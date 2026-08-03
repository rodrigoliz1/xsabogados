# Despliegue en Vercel

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
8. Use `CALENDAR_PROVIDER=mock` y `NEXT_PUBLIC_CALENDAR_PROVIDER=mock`.
9. Active `ENABLE_DEMO_AUTH=true` solo si el borrador necesita cuentas demo.
10. Ejecute `npm run db:deploy` deliberadamente contra Neon Preview.
11. Despliegue y pruebe formularios, citas, correo, login, roles y móvil.

Vercel Preview se ejecuta con `NODE_ENV=production`, pero la aplicación usa `VERCEL_ENV=preview` para permitir calendario y autenticación demo. El Preview incluye `noindex, nofollow`.

## Production

1. Cree o seleccione Neon Production, separado de Preview.
2. Configure `DATABASE_URL`, `DIRECT_URL` y un `AUTH_SECRET` distinto.
3. Configure `EMAIL_PROVIDER=brevo`, remitente verificado y sandbox desactivado.
4. Configure `CALENDAR_PROVIDER=google` y las credenciales correspondientes.
5. Configure `STORAGE_PROVIDER=s3` antes de habilitar documentos.
6. Establezca `ENABLE_DEMO_AUTH=false` y `ALLOW_DATABASE_SEED=false`.
7. Ejecute `npm run db:deploy` desde una operación controlada.
8. Despliegue Production y realice pruebas de humo.
9. Añada `xs-abogados.com` y `www.xs-abogados.com`; redirija `www` al canonical.
10. Configure únicamente los registros DNS indicados por Vercel.
11. Verifique HTTPS, sitemap, Search Console, Brevo, Neon y permisos del portal.

## Variables principales por entorno

| Variable                        | Preview                           | Production                | Secreto |
| ------------------------------- | --------------------------------- | ------------------------- | ------- |
| `DATABASE_URL`                  | Neon Preview pooled               | Neon Production pooled    | Sí      |
| `DIRECT_URL`                    | Neon Preview directa              | Neon Production directa   | Sí      |
| `AUTH_SECRET`                   | Valor exclusivo                   | Valor exclusivo distinto  | Sí      |
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
| `STORAGE_PROVIDER`              | `local` o `s3`                    | `s3`                      | No      |

Las credenciales de Google, S3 y Brevo siempre son privadas. `VERCEL_ENV`, `VERCEL_URL` y `VERCEL_PROJECT_PRODUCTION_URL` son administradas por Vercel.

## Migraciones

```bash
npm run db:generate
npm run db:deploy
```

El build solo genera Prisma Client. No ejecuta seed, `db push`, `migrate dev` ni migraciones remotas.

## Dominio anterior

Las redirecciones desde `ariassilva.com` deben configurarse en su hosting o DNS autorizado. Mapeos mínimos: `/nosotros/` a `/equipo`, `/areas-de-especializacion/` a `/areas`, `/contacto/` a `/contacto` y `/aviso-de-privacidad/` a su equivalente.

Consulte [VERCEL_SETUP.md](./VERCEL_SETUP.md), [NEON_SETUP.md](./NEON_SETUP.md), [BREVO_SETUP.md](./BREVO_SETUP.md) y [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).
