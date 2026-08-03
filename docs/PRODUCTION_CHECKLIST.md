# Checklist previo a producción

## Organización y legal

- [ ] Repositorio privado y rama principal protegida.
- [ ] Aviso de privacidad y términos aprobados jurídicamente.
- [ ] Domicilio, horario, correo, teléfono y biografías confirmados.
- [ ] Política de retención, respaldos, incidentes y altas/bajas de usuarios aprobada.

## Neon

- [ ] Production separado de Preview.
- [ ] `DATABASE_URL` pooled y `DIRECT_URL` directa configuradas correctamente.
- [ ] Migraciones revisadas y aplicadas con `npm run db:deploy`.
- [ ] Respaldos y recuperación a un punto en el tiempo activados y probados.
- [ ] Seed demo no ejecutado y datos ficticios eliminados.

## Brevo

- [ ] Dominio/remitente verificado.
- [ ] DKIM y SPF validados con los valores proporcionados por Brevo.
- [ ] DMARC configurado prudentemente.
- [ ] API key exclusiva de Production.
- [ ] Sandbox desactivado y entregas/rebotes verificados.
- [ ] Contacto, cita, recuperación, cancelación y reprogramación probados.

## Vercel y seguridad

- [ ] `AUTH_SECRET` y `RATE_LIMIT_SALT` exclusivos y fuertes.
- [ ] `ENABLE_DEMO_AUTH=false` y `ALLOW_DATABASE_SEED=false`.
- [ ] Calendario Google configurado; mock bloqueado.
- [ ] `RATE_LIMIT_PROVIDER=database`.
- [ ] Almacenamiento privado S3 configurado antes de habilitar documentos.
- [ ] Roles `CLIENT`, `LAWYER`, `ADMIN` e intentos IDOR probados.
- [ ] Recuperación, logout, cookies, CSP, HSTS y headers verificados.
- [ ] Logs sin datos sensibles y alertas operativas activas.

## Producto

- [ ] Inicio, Firma, Equipo, Áreas, Insights, 404, sitemap y robots.
- [ ] WhatsApp y datos institucionales.
- [ ] Formularios, agenda, bloqueo de doble reserva y zona horaria.
- [ ] Portal: asuntos, mensajes, documentos, citas y notas internas ocultas.
- [ ] Administración: citas, formularios, disponibilidad, ajustes y correos fallidos.
- [ ] iPhone, Android, tablet, laptop, 1440p, teclado y reduced motion.
- [ ] Dominio, `www`, HTTPS y redirecciones del sitio anterior.
