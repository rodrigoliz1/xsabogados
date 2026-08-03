import { CalendarClock, Database, Mail, ShieldCheck } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { AdminHeading, AdminStatus } from "@/components/admin/admin-primitives";
import { db } from "@/lib/db";
import { requireActor } from "@/server/policies";
import { getPublicSiteSettings } from "@/server/services/site-settings-service";

export const dynamic = "force-dynamic";

const settingsSchema = z.object({
  firmName: z.string().trim().min(2).max(120),
  domain: z
    .string()
    .trim()
    .url()
    .refine((value) => new URL(value).protocol === "https:"),
  phoneDisplay: z.string().trim().min(5).max(40),
  phoneE164: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/),
  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[1-9]\d{7,14}$/),
  whatsappMessage: z.string().trim().min(10).max(500),
  contactEmail: z.string().trim().email().max(254),
  address: z.string().trim().min(10).max(300),
  officeHours: z.string().trim().min(3).max(160),
  timezone: z.literal("America/Mexico_City"),
  socialLinks: z.string().trim().max(2000),
});

function parseSocialLinks(value: string) {
  const entries = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("=");
      if (separator < 1) throw new Error("invalid-social-link");
      const label = line.slice(0, separator).trim();
      const url = line.slice(separator + 1).trim();
      if (!label || label.length > 40) throw new Error("invalid-social-label");
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol))
        throw new Error("invalid-social-url");
      return [label, parsed.toString()] as const;
    });
  if (entries.length > 10) throw new Error("too-many-social-links");
  return Object.fromEntries(entries);
}

async function updateSettings(formData: FormData) {
  "use server";

  const actor = await requireActor(["ADMIN"]);
  const parsed = settingsSchema.safeParse({
    firmName: formData.get("firmName"),
    domain: formData.get("domain"),
    phoneDisplay: formData.get("phoneDisplay"),
    phoneE164: formData.get("phoneE164"),
    whatsappNumber: formData.get("whatsappNumber"),
    whatsappMessage: formData.get("whatsappMessage"),
    contactEmail: formData.get("contactEmail"),
    address: formData.get("address"),
    officeHours: formData.get("officeHours"),
    timezone: formData.get("timezone"),
    socialLinks: formData.get("socialLinks"),
  });
  if (!parsed.success) redirect("/admin/configuracion?error=datos");

  let socialLinks: Record<string, string>;
  try {
    socialLinks = parseSocialLinks(parsed.data.socialLinks);
  } catch {
    redirect("/admin/configuracion?error=redes");
  }

  const normalized = {
    firmName: parsed.data.firmName,
    domain: parsed.data.domain.replace(/\/$/, ""),
    phoneDisplay: parsed.data.phoneDisplay,
    phoneE164: parsed.data.phoneE164,
    whatsappNumber: parsed.data.whatsappNumber,
    whatsappMessage: parsed.data.whatsappMessage,
    contactEmail: parsed.data.contactEmail,
    address: parsed.data.address,
    officeHours: parsed.data.officeHours,
    timezone: parsed.data.timezone,
  };

  try {
    await db.$transaction(async (transaction) => {
      await transaction.siteSettings.upsert({
        where: { id: "default" },
        create: {
          id: "default",
          ...normalized,
          socialLinks,
          updatedById: actor.id,
        },
        update: { ...normalized, socialLinks, updatedById: actor.id },
      });
      await transaction.auditLog.create({
        data: {
          actorId: actor.id,
          action: "SITE_SETTINGS_UPDATED",
          entityType: "SiteSettings",
          entityId: "default",
          metadata: {
            fields: Object.keys(normalized),
            socialLinks: Object.keys(socialLinks),
          },
        },
      });
    });
  } catch {
    redirect("/admin/configuracion?error=conexion");
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
  redirect("/admin/configuracion?actualizado=1");
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [settings, params] = await Promise.all([
    getPublicSiteSettings(),
    searchParams,
  ]);
  const databaseReady = Boolean(process.env.DATABASE_URL?.trim());
  const error = firstParam(params.error);
  const integrations = [
    {
      icon: Database,
      title: "PostgreSQL",
      configured: databaseReady,
      description: "Repositorio de clientes, asuntos, agenda y configuración.",
    },
    {
      icon: CalendarClock,
      title: "Calendario",
      configured:
        process.env.CALENDAR_PROVIDER === "google" &&
        Boolean(process.env.GOOGLE_CALENDAR_ID),
      description: "Disponibilidad, reservas y sincronización de citas.",
    },
    {
      icon: Mail,
      title: "Correo transaccional",
      configured:
        (process.env.EMAIL_PROVIDER === "brevo" &&
          Boolean(
            process.env.BREVO_API_KEY &&
            process.env.EMAIL_FROM_ADDRESS &&
            process.env.EMAIL_FROM_NAME,
          )) ||
        (process.env.EMAIL_PROVIDER === "resend" &&
          Boolean(process.env.RESEND_API_KEY)),
      description: "Confirmaciones, recuperación de acceso y avisos.",
    },
    {
      icon: ShieldCheck,
      title: "Autenticación",
      configured: Boolean(process.env.AUTH_SECRET),
      description: "Sesiones privadas, roles y protección administrativa.",
    },
  ];
  const socialLinksValue = Object.entries(settings.socialLinks)
    .map(([label, url]) => `${label}=${url}`)
    .join("\n");

  return (
    <div className="space-y-8">
      <AdminHeading
        eyebrow="Sistema"
        title="Configuración"
        description="Datos institucionales persistentes y estado verificable de las integraciones del sitio."
      />

      {params.actualizado === "1" ? (
        <p
          className="rounded-xl border border-emerald-700/15 bg-emerald-700/[0.07] px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          La configuración se guardó y se aplicó al contacto, footer y WhatsApp
          públicos.
        </p>
      ) : null}
      {error ? (
        <p
          className="rounded-xl border border-red-700/15 bg-red-700/[0.06] px-4 py-3 text-sm text-red-900"
          role="alert"
        >
          {error === "redes"
            ? "Revisa las redes: utiliza una línea por red con el formato Nombre=https://..."
            : error === "conexion"
              ? "No fue posible guardar. Verifica la base de datos y la migración."
              : "Revisa los campos de configuración."}
        </p>
      ) : null}

      <section
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        aria-label="Estado de integraciones"
      >
        {integrations.map(({ icon: Icon, title, description, configured }) => (
          <article
            className="rounded-2xl border border-black/10 bg-white p-5"
            key={title}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#eeeae2] text-[#292929]">
                <Icon aria-hidden="true" size={17} />
              </span>
              <AdminStatus tone={configured ? "green" : "neutral"}>
                {configured ? "Configurada" : "Requiere credenciales"}
              </AdminStatus>
            </div>
            <h2 className="mt-6 font-serif text-xl">{title}</h2>
            <p className="mt-2 text-xs leading-5 text-black/45">
              {description}
            </p>
          </article>
        ))}
      </section>

      <form
        action={updateSettings}
        className="rounded-2xl border border-black/10 bg-white p-5 sm:p-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Nombre de la firma"
            name="firmName"
            defaultValue={settings.firmName}
            required
          />
          <Field
            label="Dominio canónico HTTPS"
            name="domain"
            defaultValue={settings.domain}
            required
            type="url"
          />
          <Field
            label="Teléfono visible"
            name="phoneDisplay"
            defaultValue={settings.phoneDisplay}
            required
          />
          <Field
            label="Teléfono E.164"
            name="phoneE164"
            defaultValue={settings.phoneE164}
            required
            placeholder="+523329602391"
          />
          <Field
            label="WhatsApp (sólo dígitos)"
            name="whatsappNumber"
            defaultValue={settings.whatsappNumber}
            required
            inputMode="numeric"
          />
          <Field
            label="Correo de contacto"
            name="contactEmail"
            defaultValue={settings.contactEmail}
            required
            type="email"
          />
          <Field
            label="Horario de atención"
            name="officeHours"
            defaultValue={settings.officeHours}
            required
          />
          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
              Zona horaria
            </span>
            <select
              className="field-light"
              defaultValue={settings.timezone}
              name="timezone"
            >
              <option value="America/Mexico_City">America/Mexico_City</option>
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
              Domicilio
            </span>
            <textarea
              className="field-light min-h-24 py-3"
              defaultValue={settings.address}
              name="address"
              required
            />
          </label>
          <label className="md:col-span-2">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
              Mensaje precargado de WhatsApp
            </span>
            <textarea
              className="field-light min-h-24 py-3"
              defaultValue={settings.whatsappMessage}
              name="whatsappMessage"
              required
            />
          </label>
          <label className="md:col-span-2">
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
              Redes sociales
            </span>
            <textarea
              className="field-light min-h-28 py-3 font-mono text-xs"
              defaultValue={socialLinksValue}
              name="socialLinks"
              placeholder={
                "LinkedIn=https://linkedin.com/company/xs-abogados\nInstagram=https://instagram.com/xsabogados"
              }
            />
            <span className="mt-2 block text-xs text-black/40">
              Una línea por red: Nombre=https://dirección
            </span>
          </label>
        </div>
        {databaseReady ? (
          <button
            className="mt-7 min-h-12 rounded-full bg-black px-6 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#292929]"
            type="submit"
          >
            Guardar configuración
          </button>
        ) : (
          <p className="mt-7 rounded-xl border border-black/10 bg-black/[0.035] px-4 py-3 text-xs leading-5 text-black/50">
            Configura DATABASE_URL y aplica la migración para habilitar el
            guardado. Mientras tanto se muestran los valores locales seguros.
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  ...props
}: {
  label: string;
  name: string;
  defaultValue: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "defaultValue"
>) {
  return (
    <label>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-black/45">
        {label}
      </span>
      <input
        className="field-light"
        defaultValue={defaultValue}
        name={name}
        {...props}
      />
    </label>
  );
}
