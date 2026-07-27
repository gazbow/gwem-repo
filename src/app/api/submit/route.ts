import { NextRequest, NextResponse } from "next/server";
import { submitSchema } from "@/lib/validation";
import { generateResult, summariseAnswers } from "@/lib/engine";
import { renderResultPdf } from "@/lib/pdf";
import { sendResultEmail, sendInternalNotification } from "@/lib/email";
import { buildLead, saveLead } from "@/lib/saveLead";

// The one serverless route: server-side result generation, PDF, email, lead storage
// (Build Spec sections 2 & 9). Runs on the Node runtime for @react-pdf/renderer.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Very small in-memory rate limiter: a few submits per IP per minute.
// Good enough for the test subdomain; swap for a shared store if scaled out.
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

// Fetch the logo from the app's own origin and return it as a data URI, or undefined
// if it isn't present. Cached across requests so we don't refetch on every submit.
let logoCache: string | null | undefined;
async function loadLogoDataUri(origin: string): Promise<string | undefined> {
  if (logoCache !== undefined) return logoCache ?? undefined;
  try {
    const res = await fetch(`${origin}/landart-logo.png`, { cache: "no-store" });
    if (!res.ok) {
      logoCache = null;
      return undefined;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") || "image/png";
    logoCache = `data:${ct};base64,${buf.toString("base64")}`;
    return logoCache;
  } catch {
    logoCache = null;
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  // 1. Validate input server-side (honeypot + shape + rate limit).
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot or malformed — respond 200-ish opaque for bots, 400 for genuine errors.
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 },
    );
  }

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please try again shortly." },
      { status: 429 },
    );
  }

  const { name, email, suburb, consent, answers, utm } = parsed.data;

  // 2. Re-run the engine server-side (never trust a client-supplied result).
  const result = generateResult(answers);

  // 3-6. Delivery. None of these may block the on-screen result: failures are logged,
  //      the lead is still returned to the client, and a retry can be queued.
  let emailed = false;
  let stored = false;

  try {
    // Best-effort: embed the Landart logo if public/landart-logo.png exists.
    // Never let a missing/failed logo break the PDF — fall back to the text wordmark.
    const logo = await loadLogoDataUri(req.nextUrl.origin);
    const pdf = await renderResultPdf(result, name, logo);
    emailed = await sendResultEmail({ to: email, name, result, pdf });
  } catch (err) {
    console.error("[submit] pdf/email step failed:", err);
  }

  try {
    const lead = buildLead({
      name,
      email,
      suburb: suburb || undefined,
      consent,
      answers,
      result,
      meta: { ip, userAgent: req.headers.get("user-agent") ?? undefined, utm },
    });
    await saveLead(lead);
    stored = true;
  } catch (err) {
    // Do not lose the lead: log for a retry queue. (Wire a durable queue here later.)
    console.error("[submit] saveLead failed — queue for retry:", err);
  }

  // 6. Internal notification (best effort) — includes the visitor's answers and concept.
  void sendInternalNotification({
    name,
    email,
    suburb: suburb || undefined,
    result,
    answers: summariseAnswers(answers),
  });

  // 7. Return success with the full result so the client can reveal it.
  return NextResponse.json({ ok: true, result, delivery: { emailed, stored } });
}
