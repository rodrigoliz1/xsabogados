import { z } from "zod";

import { emailSchema, requiredMultiline } from "@/lib/validation/common";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "La contraseña es obligatoria.").max(128),
});

export const passwordResetRequestSchema = z.object({ email: emailSchema });

export const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(72, "La contraseña no puede exceder 72 caracteres.")
  .regex(/[a-záéíóúñ]/, "Incluye al menos una minúscula.")
  .regex(/[A-ZÁÉÍÓÚÑ]/, "Incluye al menos una mayúscula.")
  .regex(/\d/, "Incluye al menos un número.")
  .regex(/[^\p{L}\p{N}]/u, "Incluye al menos un símbolo.");

export const passwordResetSchema = z.object({
  token: z.string().min(32).max(200),
  password: passwordSchema,
});

export const portalMessageSchema = z.object({
  body: requiredMultiline("El mensaje", 2, 3000),
  visibility: z.enum(["CLIENT", "INTERNAL"]).optional(),
});
