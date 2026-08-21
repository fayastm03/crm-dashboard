import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^\+?[\d\s()-]{7,}$/, "Enter a valid phone number"),
  company: z.string().optional().default(""),
  status: z.enum(["active", "inactive"]),
  lastContactDate: z.string().min(1, "Last contact date is required"),
  notes: z.string().optional().default(""),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;