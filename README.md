# XS ABOGADOS

Aplicación full-stack de XS ABOGADOS: sitio institucional, agenda, formulario de contacto, portal privado y administración. La arquitectura de despliegue es Next.js en Vercel, PostgreSQL en Neon, Prisma ORM y correo transaccional por la API de Brevo.

## Arquitectura y stack

- Next.js 16, React 19, TypeScript estricto y Tailwind CSS.
- Route Handlers y Server Actions dentro de la misma aplicación; no existe backend independiente.
- Prisma 6 con PostgreSQL. Neon proporciona una conexión pooled para runtime y una directa para migraciones.
- Auth.js con sesiones JWT, bcrypt y roles `CLIENT`, `LAWYER` y `ADMIN` comprobados en servidor.
- Brevo mediante `@getbrevo/brevo` para correo exclusivamente transaccional.
- Google Calendar para producción y proveedor mock para desarrollo o Vercel Preview.
- Almacenamiento privado local en desarrollo y S3 compatible en producción.
- Outbox persistente, auditoría, rate limiting, Zod, honeypot y protección de doble reserva.

Vercel ejecuta el sitio público, APIs, autenticación, portal y panel. Neon, Brevo y Google se consumen únicamente desde el servidor. Render no es necesario ni forma parte de esta arquitectura.

## Requisitos

- Node.js 22.x.
- npm 10 o posterior.
- PostgreSQL local opcional o un proyecto Neon.

## Instalación local

```bash
npm ci
cp .env.example .env.local
npm run db:generate
npm run dev
```

Con `EMAIL_PROVIDER=mock` y `CALENDAR_PROVIDER=mock` puede recorrerse el sitio sin servicios externos. Sin `DATABASE_URL`, contacto y agenda utilizan memoria volátil; el portal y la administración requieren PostgreSQL.

Para PostgreSQL local:

```bash
docker compose up -d db
npm run db:deploy
npm run dev
```

Use las conexiones de `compose.yaml` únicamente como datos locales de desarrollo.

## Variables de entorno

El inventario completo está en [`.env.example`](./.env.example). Ningún secreto utiliza el prefijo `NEXT_PUBLIC_`.

Grupos principales:

- Base de datos: `DATABASE_URL` pooled y `DIRECT_URL` directa.
- Autenticación: `AUTH_SECRET`, `AUTH_URL` y `NEXT_PUBLIC_SITE_URL`.
- Brevo: `EMAIL_PROVIDER`, `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`, `CONTACT_RECIPIENT_EMAIL` y `BREVO_SANDBOX_MODE`.
- Calendario: `CALENDAR_PROVIDER` y credenciales de Google.
- Seguridad: `RATE_LIMIT_PROVIDER`, `RATE_LIMIT_SALT` y límites por ventana.
- Archivos privados: `STORAGE_PROVIDER` y credenciales S3.

La aplicación valida Brevo al construir el proveedor, no durante la generación estática. Por ello el build puede ejecutarse sin secretos, pero una función de correo produce un error de configuración claro y seguro si faltan variables en runtime.

## Neon y Prisma

`DATABASE_URL` debe ser la URL pooled de Neon, normalmente con hostname `-pooler`. `DIRECT_URL` debe ser la URL directa del mismo entorno. Prisma reutiliza una única instancia global en desarrollo y no se desconecta dentro de cada solicitud.

```bash
npm run db:generate
npm run db:deploy
```

Las migraciones se aplican deliberadamente; no se ejecutan durante `build`. Consulte [docs/NEON_SETUP.md](./docs/NEON_SETUP.md).

## Seed y administrador

El seed contiene únicamente datos ficticios y requiere autorización explícita, además de contraseñas proporcionadas por variables privadas. Está bloqueado cuando `VERCEL_ENV=production` y nunca se ejecuta en build.

```bash
ALLOW_DATABASE_SEED=true \
DEMO_ADMIN_PASSWORD='valor-temporal-seguro' \
DEMO_CLIENT_PASSWORD='valor-temporal-seguro' \
DEMO_LAWYER_PASSWORD='valor-temporal-seguro' \
npm run db:seed
```

No reutilice estas contraseñas ni las publique. Para crear el primer administrador real:

```bash
read -s ADMIN_INITIAL_PASSWORD
export ADMIN_INITIAL_PASSWORD
npm run admin:create -- --email administrador@xs-abogados.com
unset ADMIN_INITIAL_PASSWORD
```

Use `--update-password` únicamente para una rotación deliberada. Consulte [docs/ADMIN_SETUP.md](./docs/ADMIN_SETUP.md).

## Brevo

Brevo envía confirmaciones y notificaciones de citas, contacto, recuperación de contraseña, cancelaciones y solicitudes de reprogramación. Cada correo tiene HTML y texto plano. La operación principal se guarda antes del envío; un fallo de correo no elimina una cita o formulario válidos. Los fallos quedan visibles para `ADMIN` en `/admin/correos` y pueden reintentarse con auditoría.

Resend se conserva temporalmente por compatibilidad, pero no es necesario ni el proveedor recomendado. Consulte [docs/BREVO_SETUP.md](./docs/BREVO_SETUP.md).

## Calendario

- Local y Preview: `CALENDAR_PROVIDER=mock` está permitido. La interfaz comunica “Solicitud recibida”; no afirma sincronización real.
- Production: `CALENDAR_PROVIDER=mock` está bloqueado y debe utilizarse `google`.
- Las fechas se guardan en UTC y se muestran en `America/Mexico_City`.
- La restricción única de segmentos de reserva evita colisiones concurrentes en base de datos.

Consulte [docs/GOOGLE_CALENDAR_SETUP.md](./docs/GOOGLE_CALENDAR_SETUP.md).

## Comandos

```bash
npm run dev
npm run build
npm run start
npm run format
npm run format:check
npm run lint
npm run typecheck
npm test
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
npm run admin:create -- --email CORREO
```

## Seguridad

- Las credenciales demo solo pueden habilitarse localmente o en Vercel Preview con `ENABLE_DEMO_AUTH=true`; se bloquean en Production y en el dominio definitivo.
- Preview recibe `noindex, nofollow`; las rutas privadas también están fuera de indexación.
- Los documentos nunca se guardan en `public/`; las descargas privadas vuelven a comprobar rol, asignación y propiedad.
- La CSP, HSTS de producción, protección de frame, referrer y permisos se configuran en `next.config.ts`.
- Los tokens de recuperación se almacenan como hash, caducan y son de un solo uso.
- La outbox no registra API keys ni respuestas sensibles del proveedor.

Consulte [docs/SECURITY.md](./docs/SECURITY.md).

## Vercel

Configuración esperada:

- Framework: Next.js.
- Root Directory: `./`.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: sin configurar.
- Node.js: 22.x.

Preview debe utilizar una base Neon separada cuando existan datos reales. Production debe usar Brevo, Google Calendar, almacenamiento privado y `ENABLE_DEMO_AUTH=false`. Las migraciones se ejecutan con `npm run db:deploy` desde una operación controlada.

Consulte [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md), [docs/VERCEL_SETUP.md](./docs/VERCEL_SETUP.md) y [DEPLOY_NOW.md](./DEPLOY_NOW.md).

## Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Despliegue](./docs/DEPLOYMENT.md)
- [Neon](./docs/NEON_SETUP.md)
- [Brevo](./docs/BREVO_SETUP.md)
- [Google Calendar](./docs/GOOGLE_CALENDAR_SETUP.md)
- [Portal](./docs/CLIENT_PORTAL.md)
- [Seguridad](./docs/SECURITY.md)
- [Checklist de producción](./docs/PRODUCTION_CHECKLIST.md)

## Pendientes externos antes de producción

- Aprobar jurídicamente el aviso de privacidad y términos.
- Confirmar domicilio, horarios, remitente y destinatario institucional.
- Verificar dominio, SPF, DKIM y DMARC con los valores mostrados por Brevo.
- Aplicar migraciones y crear el administrador real.
- Configurar Google Calendar y almacenamiento privado.
- Separar Neon Preview y Production antes de incorporar datos reales.
- Convertir el repositorio en privado antes de manejar información de clientes.
- Conectar `xs-abogados.com` y configurar redirecciones del dominio anterior.

La recepción de un formulario o solicitud de cita no crea por sí misma una relación abogado-cliente.
