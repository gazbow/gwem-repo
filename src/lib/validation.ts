import { z } from "zod";
import { questions } from "@/data/questions";
import { budgetOptions } from "@/data/config";

// Server-side validation for the submit payload (Build Spec section 9, step 1).

const validOptionIds = new Set(
  questions.flatMap((q) => q.options.map((o) => `${q.id}:${o.id}`)),
);

// Answers: questionId -> array of option ids. Validated against the real question data.
const answersSchema = z
  .record(z.string(), z.array(z.string()))
  .refine(
    (answers) =>
      Object.entries(answers).every(([qid, opts]) =>
        opts.every((oid) => validOptionIds.has(`${qid}:${oid}`)),
      ),
    { message: "Answers contain an unknown question or option." },
  );

export const submitSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  suburb: z.string().trim().max(120).optional().or(z.literal("")),
  // Optional budget: must be one of the offered bands, or empty.
  budget: z.enum(budgetOptions).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required." }),
  }),
  answers: answersSchema,
  // Honeypot: must be empty. Bots tend to fill every field.
  company: z.string().max(0).optional().or(z.literal("")),
  utm: z.record(z.string(), z.string()).optional(),
});

export type SubmitPayload = z.infer<typeof submitSchema>;
