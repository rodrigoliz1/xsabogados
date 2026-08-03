import { auth, signIn } from "@/auth";
import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { isDemoAuthAllowed } from "@/lib/environment";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function safeCallback(value: string | string[] | undefined) {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
    ? value
    : "/portal/panel";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  const session = await auth();
  const showDemoNotice = isDemoAuthAllowed();

  if (session?.user?.active) redirect(callbackUrl);

  async function authenticate(formData: FormData) {
    "use server";

    let credentialsFailed = false;
    try {
      await signIn("credentials", {
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) credentialsFailed = true;
      else throw error;
    }

    if (credentialsFailed) {
      redirect(
        `/portal/iniciar-sesion?error=credenciales&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
    }
  }

  const showError =
    params.error === "credenciales" || params.error === "CredentialsSignin";

  return (
    <section className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#0e0e0e]/90 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden min-h-[640px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(211,211,208,0.14),transparent_38%),linear-gradient(145deg,#131313,#080808)]" />
        <div className="absolute -bottom-24 -right-24 size-80 rounded-full border border-white/[0.06]" />
        <div className="absolute -bottom-10 -right-10 size-56 rounded-full border border-white/[0.06]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d3d3d0]/25 bg-[#d3d3d0]/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f7f7f5]">
            <ShieldCheck size={13} aria-hidden="true" />
            Espacio confidencial
          </span>
          <h1 className="mt-8 font-serif text-5xl leading-[0.98] tracking-[-0.035em]">
            Su estrategia,
            <br /> siempre a la vista.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">
            Consulte asuntos, próximos hitos, documentos y comunicación directa
            con su equipo legal.
          </p>
        </div>
        <div className="relative border-t border-white/10 pt-6">
          <p className="text-xs leading-5 text-white/35">
            El acceso está reservado a clientes y colaboradores autorizados por
            XS Abogados.
          </p>
        </div>
      </div>

      <div className="px-6 py-9 sm:px-12 sm:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-md">
          <div className="grid size-12 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[#d3d3d0]">
            <LockKeyhole size={19} strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d3d3d0]">
            Portal privado
          </p>
          <h2 className="mt-3 font-serif text-4xl tracking-[-0.025em] sm:text-5xl">
            Iniciar sesión
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/45">
            Ingrese con las credenciales asignadas a su expediente.
          </p>

          {showDemoNotice ? (
            <div className="mt-6 rounded-xl border border-[#d3d3d0]/25 bg-[#d3d3d0]/10 px-4 py-3 text-[10px] leading-5 text-[#f7f7f5]">
              <p className="font-bold uppercase tracking-[0.16em]">
                Entorno de demostración
              </p>
              <p className="mt-2">
                Utilice únicamente las credenciales temporales entregadas por el
                administrador. Este acceso se bloquea en producción.
              </p>
            </div>
          ) : null}

          {showError ? (
            <div
              className="mt-6 rounded-xl border border-red-300/20 bg-red-300/[0.07] px-4 py-3 text-xs leading-5 text-red-100"
              role="alert"
            >
              No pudimos validar esas credenciales. Revise el correo y la
              contraseña o solicite ayuda.
            </div>
          ) : null}

          <form action={authenticate} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Correo electrónico
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="nombre@empresa.com"
                className="h-[52px] w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#d3d3d0]/60"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Contraseña
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                required
                placeholder="••••••••"
                className="h-[52px] w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#d3d3d0]/60"
              />
            </label>
            <button
              type="submit"
              className="group flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#ffffff]"
            >
              Acceder al expediente
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </form>

          <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/portal/recuperar"
              className="transition-colors hover:text-white"
            >
              ¿Olvidó su contraseña?
            </Link>
            <Link
              href="/contacto"
              className="transition-colors hover:text-white"
            >
              Solicitar ayuda
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
