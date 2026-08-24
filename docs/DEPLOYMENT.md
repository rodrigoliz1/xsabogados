# Despliegue en Vercel

El procedimiento operativo completo y secuencial está en [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md). Este documento resume la arquitectura; el runbook prevalece para una liberación.

## Arquitectura

- Vercel ejecuta Next.js, Route Handlers, Server Actions, autenticación, agenda, portal y administración.
- Neon proporciona PostgreSQL.
- Prisma administra el esquema y las consultas.
- Brevo entrega correo transaccional.
- Google Calendar sincroniza las citas de producción.

No se requiere Render ni un backend independiente.

## Primer Preview

1. Importe el repositorio de GitHub en Vercel.
2. Confirme Framework `Next.js` y Root Directory `./`.
3. Use Install Command `npm ci`, Build Command `npm run build` y Node.js `22.x`.
4. No configure Output Directory.
5. Cree una rama o base Preview en Neon y añada su URL pooled como `DATABASE_URL` y la directa como `DIRECT_URL`.
6. Añada un `AUTH_SECRET` exclusivo de Preview.
7. Configure Brevo o utilice sandbox. `EMAIL_PROVIDER=brevo` es la validación recomendada.
   La compatibilidad transitoria con Resend permanece disponible mediante `EMAIL_PROVIDER=resend`, `RESEND_API_KEY` y `EMAIL_FROM`.
8. Use `CALENDAR_PROVIDER=mock` y `NEXT_PUBLIC_CALENDAR_PROVIDER=mock` si aún no probará Google.
9. Configure S3 y ClamAV de prueba: los documentos no deben depender del filesystem efímero de Vercel.
10. Active `ENABLE_DEMO_AUTH=true` solo si el borrador necesita cuentas demo.
11. Ejecute `npm run db:deploy` deliberadamente contra Neon Preview.
12. Despliegue y pruebe formularios, citas, correo, login/MFA, roles, archivos y móvil.

Vercel Preview se ejecuta con `NODE_ENV=production`, pero la aplicación usa `VERCEL_ENV=preview` para permitir calendario y autenticación demo. El Preview incluye `noindex, nofollow`.

## Production

1. Cree o seleccione Neon Production, separado de Preview.
2. Configure `DATABASE_URL`, `DIRECT_URL` y un `AUTH_SECRET` distinto.
3. Configure `EMAIL_PROVIDER=brevo`, remitente verificado y sandbox desactivado.
4. Configure `CALENDAR_PROVIDER=google` y las credenciales correspondientes.
5. Configure `STORAGE_PROVIDER=s3` y `FILE_SCANNER_PROVIDER=clamav`.
6. Configure claves de cifrado, MFA, rate limit database y los tres secretos de cron.
7. Establezca `ENABLE_DEMO_AUTH=false` y `ALLOW_DATABASE_SEED=false`.
8. Ejecute `npm run db:deploy` desde una operación controlada.
9. Despliegue Production y realice pruebas de humo.
10. Añada `xs-abogados.com` y `www.xs-abogados.com`; redirija `www` al canonical.
11. Configure únicamente los registros DNS indicados por Vercel.
12. Verifique HTTPS, sitemap, Search Console, Brevo, Neon, S3/ClamAV y permisos del portal.

## Variables principales por entorno

| Variable                        | Preview                           | Production                | Secreto |
| ------------------------------- | --------------------------------- | ------------------------- | ------- |
| `DATABASE_URL`                  | Neon Preview pooled               | Neon Production pooled    | Sí      |
| `DIRECT_URL`                    | Neon Preview directa              | Neon Production directa   | Sí      |
| `AUTH_SECRET`                   | Valor exclusivo                   | Valor exclusivo distinto  | Sí      |
| `DATA_ENCRYPTION_KEY_CURRENT`   | Clave exclusiva                   | Clave exclusiva distinta  | Sí      |
| `MFA_RECOVERY_CODE_PEPPER`      | Valor exclusivo                   | Valor exclusivo distinto  | Sí      |
| `NEXT_PUBLIC_SITE_URL`          | Omitir para inferir o URL Preview | `https://xs-abogados.com` | No      |
| `EMAIL_PROVIDER`                | `brevo`                           | `brevo`                   | No      |
| `BREVO_API_KEY`                 | Clave Preview/sandbox             | Clave Production          | Sí      |
| `EMAIL_FROM_ADDRESS`            | Remitente verificado              | Remitente verificado      | No      |
| `EMAIL_FROM_NAME`               | `XS ABOGADOS`                     | `XS ABOGADOS`             | No      |
| `CONTACT_RECIPIENT_EMAIL`       | Bandeja de prueba                 | Bandeja institucional     | No      |
| `CALENDAR_PROVIDER`             | `mock`                            | `google`                  | No      |
| `NEXT_PUBLIC_CALENDAR_PROVIDER` | `mock`                            | `google`                  | No      |
| `ENABLE_DEMO_AUTH`              | Opcional                          | `false`                   | No      |
| `ALLOW_DATABASE_SEED`           | `false`                           | `false`                   | No      |
| `RATE_LIMIT_PROVIDER`           | `database` o `memory`             | `database`                | No      |
| `RATE_LIMIT_SALT`               | Valor exclusivo                   | Valor exclusivo           | Sí      |
| `STORAGE_PROVIDER`              | `s3`                              | `s3`                      | No      |
| `FILE_SCANNER_PROVIDER`         | `clamav`                          | `clamav`                  | No      |

Las credenciales de Google, S3 y Brevo siempre son privadas. `VERCEL_ENV`, `VERCEL_URL` y `VERCEL_PROJECT_PRODUCTION_URL` son administradas por Vercel.

## Migraciones

```bash
npm run db:generate
npm run db:deploy
```

El build solo genera Prisma Client. No ejecuta seed, `db push`, `migrate dev` ni migraciones remotas.

Las migraciones `20260803000000_full_legal_platform` y `20260805000000_production_security_hardening` amplían cuentas, asuntos, agenda, editor, MFA, sesiones, cifrado/outbox, archivos y sincronización de forma incremental. Deben ejecutarse con `DIRECT_URL`; no se ejecutan automáticamente durante `next build`.

## Dominio anterior

Las redirecciones desde `ariassilva.com` deben configurarse en su hosting o DNS autorizado. Mapeos mínimos: `/nosotros/` a `/equipo`, `/areas-de-especializacion/` a `/areas`, `/contacto/` a `/contacto` y `/aviso-de-privacidad/` a su equivalente.

Consulte [VERCEL_SETUP.md](./VERCEL_SETUP.md), [NEON_SETUP.md](./NEON_SETUP.md), [BREVO_SETUP.md](./BREVO_SETUP.md) y [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).
