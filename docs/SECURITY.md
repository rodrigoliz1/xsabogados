# Seguridad y privacidad

## Controles implementados

- Validación Zod en cliente y servidor, sanitización, longitudes máximas y campos estrictos.
- Honeypot, verificación de origen, límites de payload y rate limiting con identificadores de red hasheados mediante `RATE_LIMIT_SALT`.
- Auth.js con cookies `httpOnly`, `secure` en producción, sesión de ocho horas y validación de versión de sesión.
- Contraseñas bcrypt, recuperación con token aleatorio almacenado como hash, expiración y uso único.
- Autorización server-side por rol, propiedad y asignación. Las notas internas no forman parte de los DTO del cliente.
- Restricción única de segmentos de cita para prevenir doble reserva concurrente.
- CSP, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, protección de frames y HSTS únicamente en Vercel Production.
- Preview y rutas privadas con `noindex`.
- Documentos fuera de `public`, claves opacas, validación de magic bytes, tamaño, MIME y descarga autorizada o firmada.
- Outbox de correo con estados, intentos, fecha del último intento, error sanitizado y `providerId`; nunca guarda claves del proveedor.

## Entornos

`NODE_ENV=production` también se usa en Vercel Preview. Las decisiones de seguridad pública utilizan `VERCEL_ENV`:

- `preview`: puede permitir calendario mock y cuentas demo únicamente con flags explícitos.
- `production`: bloquea calendario mock, credenciales demo, seed y almacenamiento local.
- El dominio `xs-abogados.com` bloquea autenticación demo aun si una variable se configurara incorrectamente.

`AUTH_SECRET`, credenciales de Neon, Brevo, Google, S3 y salts nunca deben utilizar `NEXT_PUBLIC_`.

## Correo

Brevo se inicializa al usarse, con timeout y sin reintentos automáticos del POST. Los errores remotos se transforman en mensajes genéricos antes de persistir. No se registran API keys, tokens, contraseñas, cuerpos de respuesta del proveedor ni descripciones jurídicas en logs.

Un fallo de correo no revierte una cita o formulario ya guardado. El reintento administrativo requiere sesión `ADMIN`, confirmación, reclamo atómico del registro fallido y auditoría.

## Repositorio y secretos

- Mantenga el repositorio privado antes de incorporar datos reales.
- `.env`, variantes locales, `.vercel`, `*.tsbuildinfo`, cargas y almacenamiento local están ignorados.
- Si una clave aparece alguna vez en Git, eliminarla del archivo no basta: debe revocarse y rotarse.
- No cargue bases, documentos, expedientes, mensajes o archivos de clientes al repositorio.

## Almacenamiento

Producción requiere S3 compatible antes de habilitar documentos. La aplicación no almacena documentos privados en `public`. Las URLs firmadas expiran y solo se generan después de validar acceso al asunto.

## Rate limiting

`RATE_LIMIT_PROVIDER=database` utiliza Neon y ofrece un límite compartido entre funciones. `memory` sirve para local o un Preview inicial, pero no constituye protección global en Vercel. Las IP se normalizan, se combinan con un salt y solo se persiste el hash por ventana.

## Revisión jurídica

El aviso de privacidad y términos son borradores pendientes de aprobación. Deben confirmarse responsable, domicilio, finalidades, transferencias, derechos ARCO, conservación y proveedores internacionales antes de indexarlos.

## Incidentes

Contenga el acceso, preserve evidencia, rote secretos, revise auditoría y logs, determine alcance, restaure desde respaldo y active el procedimiento interno aplicable. Nunca copie contenido jurídico sensible a herramientas de observabilidad no autorizadas.
