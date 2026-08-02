import { auth, signOut } from "@/auth";
import { PortalShell } from "@/components/portal/portal-shell";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Portal privado",
  robots: { index: false, follow: false },
};

export default async function PortalPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.active !== true) {
    redirect("/portal/iniciar-sesion?callbackUrl=%2Fportal%2Fpanel");
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/portal" });
  }

  return (
    <PortalShell
      userName={session.user.name || "Cliente XS"}
      userEmail={session.user.email || "Cuenta privada"}
      userRole={session.user.role}
      signOutAction={signOutAction}
    >
      {children}
    </PortalShell>
  );
}
