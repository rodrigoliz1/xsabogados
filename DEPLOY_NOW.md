# Desplegar XS ABOGADOS

## 1. GitHub

El cambio inicial de preparación utiliza:

```bash
git status
git add .
git commit -m "Configura Brevo y Neon para despliegue"
git push origin main
```

Para cambios posteriores, cree commits nuevos y descriptivos. Mantenga el repositorio privado antes de incorporar información real.

## 2. Neon

1. Cree proyectos o ramas separadas para Preview y Production.
2. Copie la URL pooled de cada entorno a `DATABASE_URL`.
3. Copie la URL directa a `DIRECT_URL`.
4. Configure temporalmente las variables del entorno que vaya a migrar.
5. Ejecute:

```bash
npm ci
npm run db:generate
npm run db:deploy
```

6. Cree el administrador real:

```bash
read -s ADMIN_INITIAL_PASSWORD
export ADMIN_INITIAL_PASSWORD
npm run admin:create -- --email CORREO
unset ADMIN_INITIAL_PASSWORD
```

No ejecute `db:seed` en Production.

## 3. Brevo

1. Cree y verifique el remitente o dominio.
2. Copie desde Brevo los registros DNS de DKIM y SPF; configure DMARC prudentemente.
3. Cree una API key transaccional.
4. Añada en Vercel `EMAIL_PROVIDER=brevo`, `BREVO_API_KEY`, `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME` y `CONTACT_RECIPIENT_EMAIL`.
5. Pruebe primero con `BREVO_SANDBOX_MODE=true` en Preview.
6. Pruebe una entrega real autorizada y revise los logs transaccionales.

## 4. Vercel

1. Importe el repositorio desde GitHub.
2. Framework: Next.js.
3. Root Directory: `./`.
4. Node.js: `22.x`.
5. Install Command: `npm ci`.
6. Build Command: `npm run build`.
7. No configure Output Directory.
8. Añada variables de Preview y despliegue.
9. Pruebe el borrador con Neon, Brevo y calendario mock.
10. Añada variables distintas de Production.
11. Configure Google Calendar y almacenamiento privado.
12. Conecte `xs-abogados.com` después de la aprobación.

## 5. Variables de Preview

```env
DATABASE_URL=<NEON_PREVIEW_POOLED>
DIRECT_URL=<NEON_PREVIEW_DIRECT>
AUTH_SECRET=<SECRETO_PREVIEW>
EMAIL_PROVIDER=brevo
BREVO_API_KEY=<CLAVE_PREVIEW>
EMAIL_FROM_ADDRESS=notificaciones@xs-abogados.com
EMAIL_FROM_NAME=XS ABOGADOS
CONTACT_RECIPIENT_EMAIL=<BANDEJA_DE_PRUEBA>
BREVO_SANDBOX_MODE=true
CALENDAR_PROVIDER=mock
NEXT_PUBLIC_CALENDAR_PROVIDER=mock
ENABLE_DEMO_AUTH=false
ALLOW_DATABASE_SEED=false
RATE_LIMIT_PROVIDER=database
RATE_LIMIT_SALT=<SALT_PREVIEW>
NEXT_PUBLIC_WHATSAPP_NUMBER=523329602391
NEXT_PUBLIC_PHONE_DISPLAY=+52 33 2960 2391
NEXT_PUBLIC_CONTACT_EMAIL=contacto@xs-abogados.com
NEXT_PUBLIC_ENABLE_PORTAL=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

`NEXT_PUBLIC_SITE_URL` puede omitirse para que el servidor use `VERCEL_URL`, o configurarse con la URL exacta del Preview.

## 6. Variables de Production

```env
DATABASE_URL=<NEON_PRODUCTION_POOLED>
DIRECT_URL=<NEON_PRODUCTION_DIRECT>
AUTH_SECRET=<SECRETO_PRODUCTION_DISTINTO>
NEXT_PUBLIC_SITE_URL=https://xs-abogados.com
EMAIL_PROVIDER=brevo
BREVO_API_KEY=<CLAVE_PRODUCTION>
EMAIL_FROM_ADDRESS=notificaciones@xs-abogados.com
EMAIL_FROM_NAME=XS ABOGADOS
CONTACT_RECIPIENT_EMAIL=<BANDEJA_INSTITUCIONAL>
BREVO_SANDBOX_MODE=false
CALENDAR_PROVIDER=google
NEXT_PUBLIC_CALENDAR_PROVIDER=google
GOOGLE_CLIENT_ID=<SECRETO>
GOOGLE_CLIENT_SECRET=<SECRETO>
GOOGLE_REFRESH_TOKEN=<SECRETO>
GOOGLE_CALENDAR_ID=<IDENTIFICADOR>
ENABLE_DEMO_AUTH=false
ALLOW_DATABASE_SEED=false
ALLOW_MOCK_CALENDAR_IN_PRODUCTION=false
RATE_LIMIT_PROVIDER=database
RATE_LIMIT_SALT=<SALT_PRODUCTION>
STORAGE_PROVIDER=s3
S3_ENDPOINT=<SECRETO_O_CONFIGURACION_PRIVADA>
S3_REGION=<REGION>
S3_BUCKET=<BUCKET_PRIVADO>
S3_ACCESS_KEY_ID=<SECRETO>
S3_SECRET_ACCESS_KEY=<SECRETO>
NEXT_PUBLIC_WHATSAPP_NUMBER=523329602391
NEXT_PUBLIC_PHONE_DISPLAY=+52 33 2960 2391
NEXT_PUBLIC_CONTACT_EMAIL=contacto@xs-abogados.com
NEXT_PUBLIC_ENABLE_PORTAL=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

No copie los marcadores `<...>` literalmente ni invente secretos.

## 7. Pruebas posteriores

- Inicio, Firma, Equipo, Áreas, Insights, WhatsApp y footer.
- Formulario guardado en Neon, acuse al interesado y aviso al despacho.
- Cita guardada, bloqueo de colisión y ambos correos.
- Cancelación y reprogramación.
- Recuperación de contraseña.
- Login y cierre de sesión.
- Acceso `ADMIN`, `LAWYER` y `CLIENT`; intento de abrir un asunto ajeno.
- Documentos privados y notas internas.
- Navegación móvil, teclado y reduced motion.
- Logs de Vercel, Brevo y Neon sin datos sensibles.
