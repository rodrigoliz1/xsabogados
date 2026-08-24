# Changelog de endurecimiento para producción

Fecha: 6 de agosto de 2026. Inventario generado desde el estado actual del worktree. Leyenda: `M` modificado, `A` añadido, `D` eliminado. Los archivos sin seguimiento se consideran añadidos; no se hizo commit, push ni deploy.

Estado del inventario: **88 modificados, 139 añadidos, 0 eliminados; 227 archivos en total**.

## Resumen por módulo

- Identidad: MFA TOTP, recovery codes, sesiones persistidas/revocables, cambio de contraseña, invitaciones y políticas por capacidad.
- Seguridad: cifrado AES-GCM versionado, CSP nonce, same-origin, redirects seguros, rate limiting compartido, logs redactados y runtime fail-closed.
- Datos: esquema/migraciones aditivas para roles, asuntos, editor, citas, sesiones, documentos, auditoría, outbox y sincronización.
- Integraciones: Brevo transaccional durable, Google Calendar idempotente/reintentable, S3 privado y ClamAV con cuarentena.
- Producto: portales cliente/abogado/socio/admin, negociación bilateral, contenido reservado, editor/aprobación y mejoras públicas/visuales.
- Calidad: CI, CodeQL, Dependabot, secretos, unitarias, integración PostgreSQL, Playwright y Axe.

## Dependencias

### Añadidas

- `@playwright/test` y `@axe-core/playwright` para E2E/accesibilidad.

### Retiradas

- `resend`: Brevo queda como proveedor transaccional real; `mock` se conserva para pruebas.
- `jose`: se retiró al no ser necesaria para la implementación final.

### Scripts añadidos/actualizados

- `test:integration`, `test:e2e`, `security:secrets`, `verify`, `db`, `db:validate`, `db:deploy`, `lawyer:create` y `client:create`.
- `build` genera Prisma Client, pero no migra ni ejecuta seed.

## Migraciones

- `20260803000000_full_legal_platform`: plataforma de asuntos, usuarios, portales, agenda y editor.
- `20260805000000_production_security_hardening`: propuesta bilateral, MFA, sesiones, documentos/scan, expiración de token, calendar lease, idempotencia, auditoría y outbox cifrado/durable.
- No se eliminaron tablas ni se ejecutaron migraciones remotas.

## Inventario exhaustivo de archivos

### Agenda y calendario

- `M` `src/app/admin/citas/actions.ts`
- `M` `src/app/admin/citas/page.tsx`
- `M` `src/app/api/citas/route.ts`
- `A` `src/app/api/portal/citas/[appointmentId]/ics/route.ts`
- `A` `src/app/api/portal/citas/[appointmentId]/propuestas/[proposalId]/route.ts`
- `A` `src/app/api/portal/citas/[appointmentId]/propuestas/route.ts`
- `A` `src/app/portal/abogado/citas/page.tsx`
- `M` `src/app/portal/panel/citas/page.tsx`
- `M` `src/components/appointments/appointment-manager.tsx`
- `M` `src/components/appointments/appointment-wizard.tsx`
- `A` `src/components/appointments/proposal-actions.tsx`
- `A` `src/components/appointments/proposal-form.tsx`
- `M` `src/lib/calendar/google.ts`
- `A` `src/lib/calendar/ics.ts`
- `M` `src/lib/calendar/index.ts`
- `M` `src/lib/calendar/mock.ts`
- `M` `src/lib/calendar/types.ts`
- `A` `src/lib/validation/appointment-negotiation.ts`
- `M` `src/lib/validation/appointment.ts`
- `M` `src/server/services/appointment-management-service.ts`
- `A` `src/server/services/appointment-negotiation-service.ts`
- `M` `src/server/services/appointment-service.ts`

### Aplicación y configuración general

- `A` `src/app/(auth)/portal/activar-cuenta/page.tsx`
- `A` `src/app/(auth)/portal/activar/page.tsx`
- `M` `src/app/(auth)/portal/iniciar-sesion/page.tsx`
- `M` `src/app/api/agenda/disponibilidad/route.ts`
- `A` `src/app/api/cron/calendar-sync/route.ts`
- `A` `src/app/api/cron/document-scan/route.ts`
- `A` `src/app/api/cron/email-outbox/route.ts`
- `M` `src/app/layout.tsx`
- `M` `src/app/manifest.ts`
- `M` `src/app/robots.ts`
- `M` `src/app/sitemap.ts`
- `A` `src/components/articles/article-editor.tsx`
- `A` `src/components/articles/article-review-panel.tsx`
- `A` `src/components/articles/article-workflow-button.tsx`
- `M` `src/lib/environment.ts`
- `A` `src/lib/runtime-configuration.ts`
- `A` `src/lib/validation/article.ts`
- `M` `src/lib/validation/auth.ts`
- `M` `src/lib/validation/index.ts`
- `A` `src/lib/validation/matter.ts`
- `A` `src/lib/validation/user.ts`

### Configuración, dependencias y CI

- `M` `.env.example`
- `A` `.github/dependabot.yml`
- `A` `.github/workflows/ci.yml`
- `A` `.github/workflows/codeql.yml`
- `M` `next-env.d.ts`
- `M` `next.config.ts`
- `M` `package-lock.json`
- `M` `package.json`
- `A` `playwright.config.ts`
- `M` `vitest.config.mts`
- `A` `vitest.integration.config.mts`

### Correo y outbox

- `M` `src/app/admin/correos/actions.ts`
- `M` `src/app/admin/correos/page.tsx`
- `M` `src/app/admin/correos/retry-email-button.tsx`
- `M` `src/lib/email/index.ts`
- `A` `src/lib/email/outbox-policy.ts`
- `M` `src/lib/email/providers.ts`
- `M` `src/lib/email/types.ts`

### Documentación

- `M` `DEPLOY_NOW.md`
- `M` `docs/ADMIN_SETUP.md`
- `A` `docs/APPOINTMENTS.md`
- `A` `docs/ARTICLE_APPROVAL.md`
- `A` `docs/AVAILABILITY.md`
- `M` `docs/BREVO_SETUP.md`
- `A` `docs/CHANGELOG_PRODUCTION_HARDENING.md`
- `M` `docs/CLIENT_PORTAL.md`
- `A` `docs/DATA_CLASSIFICATION_AND_RETENTION.md`
- `A` `docs/DEPLOYMENT_RUNBOOK.md`
- `M` `docs/DEPLOYMENT.md`
- `A` `docs/ENVIRONMENT_VARIABLES.md`
- `A` `docs/FINAL_IMPLEMENTATION_PLAN.md`
- `A` `docs/INSIGHTS_EDITOR.md`
- `A` `docs/LAWYER_PORTAL.md`
- `A` `docs/MEDIA_STORAGE.md`
- `M` `docs/NEON_SETUP.md`
- `A` `docs/PARTNER_PORTAL.md`
- `A` `docs/PERMISSIONS.md`
- `M` `docs/PRODUCTION_CHECKLIST.md`
- `A` `docs/SECURITY_HARDENING.md`
- `M` `docs/SECURITY.md`
- `A` `docs/TEST_REPORT.md`
- `M` `README.md`

### Documentos, medios y almacenamiento

- `A` `src/app/api/media/[mediaId]/route.ts`
- `M` `src/app/api/portal/asuntos/[matterId]/documentos/[documentId]/route.ts`
- `M` `src/app/api/portal/asuntos/[matterId]/documentos/route.ts`
- `A` `src/app/api/portal/media/route.ts`
- `A` `src/lib/documents/config.ts`
- `A` `src/lib/documents/inspection.ts`
- `A` `src/lib/documents/scanner/clamav.ts`
- `A` `src/lib/documents/scanner/index.ts`
- `A` `src/lib/documents/scanner/mock.ts`
- `A` `src/lib/documents/scanner/types.ts`
- `M` `src/lib/storage/index.ts`
- `M` `src/lib/storage/local.ts`
- `M` `src/lib/storage/s3.ts`
- `M` `src/lib/storage/types.ts`

### Identidad, seguridad y observabilidad

- `A` `src/app/api/auth/activar/route.ts`
- `A` `src/app/api/auth/mfa/confirm/route.ts`
- `A` `src/app/api/auth/mfa/recovery-codes/route.ts`
- `A` `src/app/api/auth/mfa/setup/route.ts`
- `A` `src/app/api/auth/password/change/route.ts`
- `A` `src/app/api/health/route.ts`
- `A` `src/app/portal/seguridad/contrasena/page.tsx`
- `A` `src/app/portal/seguridad/mfa/page.tsx`
- `A` `src/app/portal/seguridad/sesiones/page.tsx`
- `M` `src/auth.ts`
- `A` `src/instrumentation.ts`
- `A` `src/lib/observability/logger.ts`
- `A` `src/lib/security/cron.ts`
- `A` `src/lib/security/encryption.ts`
- `M` `src/lib/security/rate-limit.ts`
- `A` `src/lib/security/redirects.ts`
- `M` `src/lib/security/request.ts`
- `A` `src/lib/security/totp.ts`
- `A` `src/proxy.ts`
- `M` `src/server/policies/access.ts`
- `M` `src/server/policies/rules.ts`

### Portales, administración y servicios

- `A` `src/app/admin/abogados/[id]/page.tsx`
- `A` `src/app/admin/abogados/page.tsx`
- `A` `src/app/admin/articulos/[articleId]/page.tsx`
- `M` `src/app/admin/articulos/page.tsx`
- `A` `src/app/admin/articulos/pendientes/page.tsx`
- `A` `src/app/admin/articulos/publicados/page.tsx`
- `A` `src/app/admin/asuntos/actions.ts`
- `M` `src/app/admin/asuntos/page.tsx`
- `A` `src/app/admin/auditoria/page.tsx`
- `A` `src/app/admin/clientes/[id]/page.tsx`
- `M` `src/app/admin/clientes/page.tsx`
- `M` `src/app/admin/configuracion/page.tsx`
- `M` `src/app/admin/layout.tsx`
- `A` `src/app/admin/mensajes/page.tsx`
- `M` `src/app/admin/page.tsx`
- `A` `src/app/admin/usuarios/actions.ts`
- `A` `src/app/admin/usuarios/page.tsx`
- `A` `src/app/api/admin/articulos/[articleId]/revision/route.ts`
- `A` `src/app/api/portal/articulos/[articleId]/enviar/route.ts`
- `A` `src/app/api/portal/articulos/[articleId]/publicar/route.ts`
- `A` `src/app/api/portal/articulos/[articleId]/route.ts`
- `A` `src/app/api/portal/articulos/route.ts`
- `A` `src/app/api/portal/asuntos/[matterId]/avances/route.ts`
- `M` `src/app/api/portal/asuntos/[matterId]/mensajes/route.ts`
- `A` `src/app/portal/abogado/articulos/[articleId]/editar/page.tsx`
- `A` `src/app/portal/abogado/articulos/[articleId]/page.tsx`
- `A` `src/app/portal/abogado/articulos/nuevo/page.tsx`
- `A` `src/app/portal/abogado/articulos/page.tsx`
- `A` `src/app/portal/abogado/asuntos/[matterId]/page.tsx`
- `A` `src/app/portal/abogado/asuntos/actions.ts`
- `A` `src/app/portal/abogado/asuntos/page.tsx`
- `A` `src/app/portal/abogado/disponibilidad/actions.ts`
- `A` `src/app/portal/abogado/disponibilidad/page.tsx`
- `A` `src/app/portal/abogado/layout.tsx`
- `A` `src/app/portal/abogado/mensajes/page.tsx`
- `A` `src/app/portal/abogado/notificaciones/page.tsx`
- `A` `src/app/portal/abogado/page.tsx`
- `A` `src/app/portal/abogado/perfil/page.tsx`
- `A` `src/app/portal/abogado/usuarios/actions.ts`
- `A` `src/app/portal/abogado/usuarios/page.tsx`
- `A` `src/app/portal/notification-actions.ts`
- `M` `src/app/portal/page.tsx`
- `M` `src/app/portal/panel/layout.tsx`
- `A` `src/app/portal/panel/notificaciones/page.tsx`
- `A` `src/app/portal/socio/articulos/[articleId]/revision/page.tsx`
- `A` `src/app/portal/socio/articulos/page.tsx`
- `A` `src/app/portal/socio/articulos/pendientes/page.tsx`
- `A` `src/app/portal/socio/layout.tsx`
- `M` `src/components/admin/admin-shell.tsx`
- `A` `src/components/portal/activation-form.tsx`
- `M` `src/components/portal/message-composer.tsx`
- `A` `src/components/portal/mfa-enrollment.tsx`
- `A` `src/components/portal/mfa-recovery-manager.tsx`
- `A` `src/components/portal/notification-list.tsx`
- `A` `src/components/portal/password-change-form.tsx`
- `M` `src/components/portal/portal-shell.tsx`
- `A` `src/server/services/account-service.ts`
- `A` `src/server/services/article-service.ts`
- `M` `src/server/services/availability-service.ts`
- `A` `src/server/services/calendar-sync-service.ts`
- `A` `src/server/services/document-scan-service.ts`
- `A` `src/server/services/matter-update-service.ts`
- `M` `src/server/services/password-reset-service.ts`
- `M` `src/server/services/portal-service.ts`

### Prisma y migraciones

- `A` `prisma/migrations/20260803000000_full_legal_platform/migration.sql`
- `A` `prisma/migrations/20260805000000_production_security_hardening/migration.sql`
- `M` `prisma/schema.prisma`

### Pruebas

- `A` `e2e/public-and-security.spec.ts`
- `A` `tests/appointment-proposal-policy.test.ts`
- `M` `tests/authorization.test.ts`
- `A` `tests/cron-auth.test.ts`
- `A` `tests/document-config.test.ts`
- `A` `tests/document-inspection.test.ts`
- `A` `tests/document-scan-service.test.ts`
- `A` `tests/document-scanner.test.ts`
- `A` `tests/document-storage-local.test.ts`
- `A` `tests/email-outbox-policy.test.ts`
- `A` `tests/email-outbox-processor.test.ts`
- `A` `tests/encryption.test.ts`
- `M` `tests/environment.test.ts`
- `A` `tests/ics.test.ts`
- `A` `tests/integration/database-invariants.test.ts`
- `A` `tests/invitation-token.test.ts`
- `A` `tests/logger-redaction.test.ts`
- `A` `tests/request-security.test.ts`
- `A` `tests/runtime-configuration.test.ts`
- `A` `tests/safe-redirect.test.ts`
- `M` `tests/storage-s3.test.ts`
- `A` `tests/totp.test.ts`
- `M` `tests/validation.test.ts`

### Scripts operativos

- `A` `scripts/check-secrets.mjs`
- `A` `scripts/create-invited-account.ts`

### Sitio público y contenido

- `M` `src/app/(public)/agenda/page.tsx`
- `M` `src/app/(public)/areas/[slug]/page.tsx`
- `M` `src/app/(public)/areas/page.tsx`
- `M` `src/app/(public)/aviso-de-privacidad/page.tsx`
- `M` `src/app/(public)/equipo/[slug]/page.tsx`
- `M` `src/app/(public)/equipo/page.tsx`
- `M` `src/app/(public)/firma/page.tsx`
- `M` `src/app/(public)/insights/[slug]/page.tsx`
- `M` `src/app/(public)/insights/page.tsx`
- `M` `src/app/(public)/layout.tsx`
- `M` `src/app/(public)/page.tsx`
- `M` `src/components/home/home-hero.tsx`
- `M` `src/components/practice-areas/PracticeAreaCard.tsx`
- `A` `src/components/seo/json-ld.tsx`
- `M` `src/components/ui/editorial-image.tsx`

## Archivos eliminados

No se eliminó ningún archivo versionado. El cambio de `vitest.integration.config.ts` a `.mts` ocurrió mientras el archivo aún era nuevo/no versionado, por lo que el inventario final registra únicamente `vitest.integration.config.mts`.

## Compatibilidad y datos

- Se conservaron textos públicos y ajustes del usuario; los cambios de contenido se limitaron a solicitudes expresas y correcciones operativas/documentales.
- Los aliases de enums heredados se mantienen para leer datos existentes; las lecturas normalizan visibilidad sin migración destructiva.
- La migración de hardening hace backfill antes de exigir `proposerSide` y deja payload legacy de correo migrable en lectura.

## Acciones deliberadamente no realizadas

No hubo commit, push, deploy, migración/seed de Neon, envío Brevo, evento Google ni carga S3 real. Esas acciones están descritas en `DEPLOYMENT_RUNBOOK.md`.
