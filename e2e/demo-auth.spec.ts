import { expect, test, type Page } from "@playwright/test";

const credentials = {
  admin: {
    email: "admin@xs-abogados.local",
    password: process.env.E2E_DEMO_ADMIN_PASSWORD,
  },
  partner: {
    email: "abogado@xs-abogados.local",
    password: process.env.E2E_DEMO_LAWYER_PASSWORD,
  },
  associate: {
    email: "asociado@xs-abogados.local",
    password: process.env.E2E_DEMO_LAWYER_PASSWORD,
  },
  client: {
    email: "cliente@xs-abogados.local",
    password: process.env.E2E_DEMO_CLIENT_PASSWORD,
  },
} as const;

const demoPasswordsConfigured = Object.values(credentials).every(
  ({ password }) => Boolean(password),
);

async function signIn(
  page: Page,
  input: { email: string; password?: string },
  callbackUrl: string,
) {
  await page.goto(
    `/portal/iniciar-sesion?callbackUrl=${encodeURIComponent(callbackUrl)}`,
  );
  await dismissPreviewAccess(page);
  await page
    .getByLabel("Correo electrónico", { exact: true })
    .fill(input.email);
  await page
    .getByLabel("Contraseña", { exact: true })
    .fill(input.password ?? "");
  await page.getByRole("button", { name: "Acceder al expediente" }).click();
}

async function dismissPreviewAccess(page: Page) {
  const dialog = page.getByRole("dialog", {
    name: "Vista previa restringida",
  });
  if (await dialog.isVisible()) {
    await dialog
      .getByRole("button", { name: "Continuar Vista Previa Restringida" })
      .click();
    await expect(dialog).toBeHidden();
  }
}

test.describe("credenciales DEMO locales", () => {
  test.skip(
    !demoPasswordsConfigured,
    "Configura E2E_DEMO_*_PASSWORD para probar cuentas locales.",
  );

  test("cliente accede únicamente a su panel", async ({ page }) => {
    await signIn(page, credentials.client, "/portal/panel");
    await expect(page).toHaveURL(/\/portal\/panel$/);
    await expect(
      page.getByRole("heading", { name: "Su panorama legal" }),
    ).toBeVisible();
    await page.goto("/portal/seguridad/mfa");
    await expect(page.getByText(/opcional y recomendada/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continuar sin activarla" }),
    ).toHaveAttribute("href", "/portal/panel");
  });

  test("asociado accede y administra un borrador con imagen", async ({
    page,
  }, testInfo) => {
    await signIn(page, credentials.associate, "/portal/abogado");
    await expect(page).toHaveURL(/\/portal\/abogado$/);
    await expect(
      page.getByRole("heading", { name: "Panorama profesional" }),
    ).toBeVisible();

    await page.goto("/portal/abogado/articulos/nuevo");
    await dismissPreviewAccess(page);
    const title = `Prueba editorial ${testInfo.project.name} ${Date.now()}`;
    await page.getByLabel("Título", { exact: true }).fill(title);
    await page
      .getByLabel("Resumen", { exact: true })
      .fill(
        "Resumen suficientemente amplio para validar el guardado persistente del borrador editorial.",
      );
    await page
      .getByLabel("Introducción", { exact: true })
      .fill("Introducción visible en la previsualización del artículo.");
    await page
      .getByRole("textbox", { name: "Párrafo" })
      .fill(
        "Contenido de prueba ".repeat(120) +
          "que debe mantenerse dentro de la vista compacta.",
      );
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        `${process.cwd()}/public/images/editorial/puerta-de-hierro.webp`,
      );
    await page
      .getByPlaceholder("Texto alternativo descriptivo")
      .fill("Edificio corporativo en Puerta de Hierro");
    await page.getByRole("button", { name: "Subir imagen" }).click();
    await expect(
      page.getByText("Imagen optimizada y almacenada", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Vista previa de la imagen destacada" }),
    ).toBeVisible();
    await expect(page.getByTestId("compact-article-preview")).toHaveCSS(
      "overflow",
      "hidden",
    );
    await page.getByRole("button", { name: "Ampliar" }).click();
    await expect(
      page.getByRole("dialog", {
        name: "Vista previa ampliada del artículo",
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Cerrar vista previa" }).click();
    await page.getByRole("button", { name: "Guardar borrador" }).click();
    await expect(page).toHaveURL(/\/portal\/abogado\/articulos\/.+\/editar$/);
    await expect(page.getByText("Borrador guardado.")).toBeVisible();
    const articleId = page.url().split("/").at(-2);
    expect(articleId).toBeTruthy();

    await page.goto(`/portal/abogado/articulos/${articleId}`);
    await dismissPreviewAccess(page);
    await page.getByRole("button", { name: "Archivar" }).click();
    await expect(page.getByText("Artículo archivado.")).toBeVisible();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Eliminar" }).click();
    await expect(page).toHaveURL(/\/portal\/abogado\/articulos$/);
  });

  test("socio puede entrar con MFA opcional", async ({ page }) => {
    await signIn(page, credentials.partner, "/portal/socio/articulos");
    await expect(page).toHaveURL(/\/portal\/abogado\/articulos$/);
    await expect(
      page.getByRole("heading", { name: "Mis artículos" }),
    ).toBeVisible();
  });

  test("administrador puede entrar con MFA opcional", async ({ page }) => {
    await signIn(page, credentials.admin, "/admin");
    await expect(page).toHaveURL(/\/admin$/);
  });
});
