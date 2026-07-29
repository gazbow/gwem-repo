import type { Answers, GuideResult } from "@/lib/types";

// Swappable lead-storage adapter (Build Spec section 9).
// Everything writes through the single saveLead() function, so the storage layer
// can be replaced with a CRM later without touching the API route.

export interface Lead {
  name: string;
  email: string;
  suburb?: string;
  budget?: string;
  consent: boolean;
  answers: Answers;
  resultSummary: {
    style: string;
    plants: string[];
    features: string[];
  };
  timestamp: string; // ISO
  meta?: {
    ip?: string;
    userAgent?: string;
    utm?: Record<string, string>;
  };
}

export function buildLead(input: {
  name: string;
  email: string;
  suburb?: string;
  budget?: string;
  consent: boolean;
  answers: Answers;
  result: GuideResult;
  meta?: Lead["meta"];
}): Lead {
  return {
    name: input.name,
    email: input.email,
    suburb: input.suburb,
    budget: input.budget,
    consent: input.consent,
    answers: input.answers,
    resultSummary: {
      style: input.result.style.name,
      plants: input.result.plants.map((p) => p.name),
      features: input.result.features.map((f) => f.name),
    },
    timestamp: new Date().toISOString(),
    meta: input.meta,
  };
}

type Adapter = (lead: Lead) => Promise<void>;

// --- Adapters ---------------------------------------------------------------

const consoleAdapter: Adapter = async (lead) => {
  // eslint-disable-next-line no-console
  console.info("[lead] captured (console adapter):", JSON.stringify(lead));
};

// Google Sheets via a simple Apps Script Web App that appends a row.
const googleSheetsAdapter: Adapter = async (lead) => {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL not set");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Google Sheets webhook failed: ${res.status}`);
};

const airtableAdapter: Adapter = async (lead) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE_NAME ?? "Leads";
  if (!apiKey || !baseId) throw new Error("Airtable env vars not set");
  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: lead.name,
          Email: lead.email,
          Suburb: lead.suburb ?? "",
          Budget: lead.budget ?? "",
          Consent: lead.consent,
          Style: lead.resultSummary.style,
          Plants: lead.resultSummary.plants.join(", "),
          Features: lead.resultSummary.features.join(", "),
          Answers: JSON.stringify(lead.answers),
          Timestamp: lead.timestamp,
        },
      }),
    },
  );
  if (!res.ok) throw new Error(`Airtable request failed: ${res.status}`);
};

function getAdapter(): Adapter {
  switch ((process.env.LEAD_STORAGE ?? "console").toLowerCase()) {
    case "google-sheets":
      return googleSheetsAdapter;
    case "airtable":
      return airtableAdapter;
    default:
      return consoleAdapter;
  }
}

/**
 * Persist a lead. Throws on failure so the caller can log/queue a retry —
 * but the API route is written so a storage failure never blocks the on-screen result.
 */
export async function saveLead(lead: Lead): Promise<void> {
  await getAdapter()(lead);
}
