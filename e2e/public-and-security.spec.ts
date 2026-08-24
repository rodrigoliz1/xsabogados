import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

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

test("sitio público, dirección y WhatsApp", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/XS ABOGADOS/i);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.locator('a[href*="google.com/maps"]').first(),
  ).toBeVisible();
  await expect(page.locator('a[href^="https://wa.me/"]').first()).toBeVisible();
});

test("home hidrata sin discrepancias de React", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydration|hydrated|server rendered html/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  expect(hydrationErrors).toEqual([]);
});

test("aviso temporal reaparece al recargar y no durante la navegación", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", {
    name: "Vista previa restringida",
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByText(
      "El presente proyecto se encuentra pendiente de conclusión, por lo que el acceso completo se encuentra limitado.",
    ),
  ).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: /www\.ipunto\.digital/i }),
  ).toHaveAttribute("href", "https://www.ipunto.digital");
  await expect(
    dialog.getByRole("link", {
      name: "Contactar a administración por WhatsApp",
    }),
  ).toHaveAttribute("href", /wa\.me\/526692122543/);

  const countdown = dialog.getByTestId("preview-countdown");
  await expect(countdown).toHaveAttribute("data-remaining-seconds", /\d+/);
  const initialSeconds = Number(
    await countdown.getAttribute("data-remaining-seconds"),
  );
  await expect
    .poll(async () =>
      Number(await countdown.getAttribute("data-remaining-seconds")),
    )
    .toBeLessThan(initialSeconds);

  await dismissPreviewAccess(page);
  await page.evaluate(() => {
    document.querySelector<HTMLAnchorElement>('a[href="/firma"]')?.click();
  });
  await expect(page).toHaveURL(/\/firma$/);
  await expect(dialog).toBeHidden();

  await page.reload();
  await expect(dialog).toBeVisible();
});

test("insights conserva buscador único y perfiles muestran contacto", async ({
  page,
}, testInfo) => {
  await page.goto("/insights");
  await dismissPreviewAccess(page);
  await expect(
    page.getByPlaceholder("Buscar por tema o palabra clave"),
  ).toBeVisible();
  await expect(page.getByText("Publicaciones del equipo")).toHaveCount(0);

  await page.goto("/equipo/alejandro-guerrero");
  await dismissPreviewAccess(page);
  const directContact = page
    .getByText("Contacto directo", { exact: true })
    .locator("..");
  await expect(directContact).toBeVisible();
  await expect(
    directContact.getByText("Correo", { exact: true }),
  ).toBeVisible();
  await expect(
    directContact.getByText("Celular", { exact: true }),
  ).toBeVisible();
  await expect(
    directContact.getByText("WhatsApp", { exact: true }),
  ).toBeVisible();
  await expect(
    directContact.getByText("LinkedIn", { exact: true }),
  ).toBeVisible();

  const portrait = page.getByRole("img", {
    name: /Retrato profesional de Alejandro Guerrero/,
  });
  await expect(portrait).toHaveCSS("filter", /grayscale\(1\)/);
  if (testInfo.project.name === "chromium") {
    await portrait.hover();
    await expect(portrait).toHaveCSS("filter", /grayscale\(0\)/);
  }
});

test("rutas privadas redirigen al acceso", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/portal\/iniciar-sesion/);
  await expect(
    page.getByRole("heading", { name: /iniciar sesión/i }),
  ).toBeVisible();
});

test("documentos jurídicos publicados no muestran avisos provisionales", async ({
  page,
}) => {
  for (const path of ["/aviso-de-privacidad", "/terminos"]) {
    await page.goto(path);
    await expect(page.locator("body")).not.toContainText(
      /pendiente de revisión|borrador legal|texto provisional/i,
    );
  }
});

test("home y login sin violaciones críticas de accesibilidad", async ({
  page,
}) => {
  for (const path of ["/", "/portal/iniciar-sesion"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .analyze();
    const critical = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  }
});
