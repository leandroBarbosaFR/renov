import { z } from "zod";

const required = (label: string, max = 120) =>
  z
    .string({ error: `${label} est requis.` })
    .trim()
    .min(1, `${label} est requis.`)
    .max(max, `${label} est trop long.`);

export const contactSchema = z.object({
  lastName: required("Le nom"),
  firstName: required("Le prénom"),
  email: z.string().trim().min(1, "L’email est requis.").pipe(z.email("Adresse email invalide.")),
  phone: z
    .string()
    .trim()
    .min(1, "Le téléphone est requis.")
    .refine((v) => /^\+?[\d\s.\-()]{10,20}$/.test(v) && v.replace(/\D/g, "").length >= 10, "Numéro de téléphone invalide."),
  address: required("L’adresse du chantier", 200),
  city: required("La ville"),
  postalCode: z.string().trim().regex(/^\d{5}$/, "Code postal invalide (5 chiffres)."),
  timeframe: required("Le délai", 80),
  renovationType: z.string().trim().max(80).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Décrivez vos travaux en quelques phrases (20 caractères minimum).")
    .max(5000, "Le descriptif est trop long (5000 caractères maximum)."),
  consent: z.literal("on", { error: "Votre accord est nécessaire pour traiter la demande." }),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
}

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
