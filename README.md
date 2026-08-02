# XS ABOGADOS

Sitio institucional, agenda, portal del cliente y panel administrativo para **XS ABOGADOS**. El proyecto reemplaza la identidad de Arias & Silva con una experiencia editorial monocromática, responsive y preparada para `xs-abogados.com`.

## Qué incluye

- Sitio público completo: Inicio, Firma, Equipo, perfiles, Áreas, páginas de práctica, Perspectivas, artículos, Agenda, Contacto, Portal, Aviso de privacidad, Términos y 404.
- Agenda por pasos con proveedor local simulado, cálculo de disponibilidad, validación cliente/servidor y prevención de reservas duplicadas.
- Formularios de contacto y cita protegidos con Zod, honeypot, sanitización y rate limiting.
- Autenticación Auth.js, roles `CLIENT`, `LAWYER` y `ADMIN`, portal privado y panel administrativo conectado a datos reales.
- Administración de citas, asignaciones, notas internas, disponibilidad, bloqueos e información institucional con auditoría.
- Prisma con PostgreSQL, seed DEMO únicamente para desarrollo y modelos para clientes, asuntos, citas, documentos, mensajes, auditoría, artículos y configuración.
- Capa de proveedores para calendario, correo, almacenamiento y analítica.
- SEO técnico: metadata por página, canonical, Open Graph, Schema.org, sitemap, robots y manifest.
- Diseño accesible con navegación por teclado, foco visible, skip link, contraste AA y respeto a `prefers-reduced-motion`.

## Requisitos

- Node.js 22 o 24.
- npm 10 o superior.
- Docker Desktop opcional, recomendado para PostgreSQL local.
- Una base PostgreSQL administrada para producción.

## Inicio rápido

Para recorrer el sitio público y usar los proveedores mock no se necesitan credenciales externas:

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

En este modo, contacto y agenda usan una memoria local volátil para permitir el recorrido completo y prevenir dobles reservas; los datos se reinician al detener el servidor. El portal y la administración requieren PostgreSQL.

Para activar persistencia y el seed local:

```bash
cp .env.example .env.local
docker compose up -d db
npm run db:migrate
npm run db:seed
npm run dev
```

En `.env.local`, utiliza para Docker local:

```env
DATABASE_URL="postgresql://xs_local:xs_local_only@localhost:5433/xs_abogados?schema=public"
AUTH_SECRET="genera-un-secreto-local-largo"
ENABLE_DEMO_AUTH=true
CALENDAR_PROVIDER=mock
EMAIL_PROVIDER=mock
STORAGE_PROVIDER=local
```

Genera `AUTH_SECRET` con `openssl rand -base64 32`. Nunca reutilices un secreto de desarrollo en producción.

## Comandos

```bash
npm run dev          # desarrollo
npm run build        # Prisma generate + build de producción
npm run start        # servir build
npm run lint         # ESLint
npm run typecheck    # TypeScript estricto
npm test             # Vitest
npm run format       # Prettier
npm run db:migrate   # migración de desarrollo
npm run db:deploy    # migraciones en producción
npm run db:seed      # datos DEMO, bloqueados en producción
npm run db:studio    # explorar PostgreSQL local
```

## Variables de entorno

Consulta [`.env.example`](./.env.example). Los grupos principales son:

- `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`.
- `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_RECIPIENT_EMAIL`.
- Credenciales de Google Calendar o Cal.com.
- Credenciales S3 compatibles para archivos privados.
- Teléfono, WhatsApp, correo y domicilio públicos.
- Flags de analítica, portal, proveedores mock y acceso DEMO.

El código debe fallar de forma cerrada en producción si se intenta habilitar un proveedor mock o credenciales DEMO.

## Base de datos y seed

El esquema canónico está en `prisma/schema.prisma`, usa PostgreSQL e incluye una migración inicial versionada en `prisma/migrations`. Toda migración posterior debe generarse y revisarse en desarrollo antes de ejecutar `npm run db:deploy` en producción.

El seed crea información **completamente ficticia** y tres cuentas únicamente cuando `NODE_ENV !== "production"`:

- `admin@xs-abogados.local` — `XS-Admin-2026!`
- `cliente@xs-abogados.local` — `XS-Cliente-2026!`
- `abogado@xs-abogados.local` — `XS-Abogado-2026!`

No deben reutilizarse ni activarse en producción.

## Integraciones

- Correo: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) y [docs/SECURITY.md](./docs/SECURITY.md).
- Google Calendar / Cal.com: [docs/CALENDAR_SETUP.md](./docs/CALENDAR_SETUP.md).
- Portal y roles: [docs/CLIENT_PORTAL.md](./docs/CLIENT_PORTAL.md).
- Edición de contenido e imágenes: [docs/CONTENT_GUIDE.md](./docs/CONTENT_GUIDE.md).
- Decisiones técnicas: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Despliegue en Vercel

1. Sube el proyecto a un repositorio privado.
2. Importa el repositorio en Vercel como proyecto Next.js.
3. Crea PostgreSQL administrado y configura `DATABASE_URL`.
4. Carga todas las variables de producción; desactiva DEMO y mocks.
5. Ejecuta migraciones con `npm run db:deploy` desde un job controlado.
6. Despliega y prueba formularios, inicio de sesión, permisos, correo, calendario y archivos.
7. Añade `xs-abogados.com` y `www.xs-abogados.com`; elige el dominio canónico y redirige la variante.
8. Configura los registros DNS indicados por Vercel. No se modifica DNS desde este repositorio.
9. Verifica HTTPS, Search Console, sitemap, remitente de correo y protección del portal.

Consulta el procedimiento completo en [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Pendientes antes de producción

- Revisión jurídica y aprobación del aviso de privacidad y términos.
- Confirmar razón social responsable, domicilio, correo, horarios y política de transferencia de datos.
- Confirmar que `contacto@xs-abogados.com` y los remitentes de Resend existen.
- Reemplazar los monogramas de Felipe Ibarra Ibarra y José Luis Ahumada cuando existan retratos aprobados.
- Revisar perfiles, artículos DEMO y metadatos con el despacho.
- Crear usuarios reales y deshabilitar `ENABLE_DEMO_AUTH`.
- Conectar PostgreSQL, Google Calendar o Cal.com, Resend y almacenamiento privado.
- Ejecutar revisión de conflictos, permisos por rol, restauración de respaldo y respuesta a incidentes.
- Configurar redirecciones del dominio anterior en su hosting o al apuntarlo a Vercel.
- Completar pruebas en iPhone, Android, tablet, laptop y 1440p antes del lanzamiento.

## Nota legal

El contenido institucional e informativo no sustituye asesoría jurídica para un caso particular. La recepción de un formulario o solicitud de cita no crea por sí misma una relación abogado–cliente.
# xsabogados
