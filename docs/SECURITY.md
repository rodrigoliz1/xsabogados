# Seguridad y privacidad

## Controles implementados

- Validación Zod en cliente y servidor.
- Sanitización de entradas y tratamiento de mensajes como texto plano.
- Honeypot y rate limiting para formularios públicos.
- Auth.js con cookies `httpOnly`, `secure` en producción y `sameSite` adecuado.
- Contraseñas con bcrypt y credenciales DEMO limitadas a desarrollo.
- Autorización server-side por rol, asignación y propiedad.
- Selecciones explícitas para evitar exponer notas internas.
- Auditoría de operaciones sensibles sin copiar contenido jurídico completo.
- Cabeceras `nosniff`, frame protection, referrer y permissions policy.
- Documentos fuera de `public`, claves opacas, MIME/tamaño permitidos y descarga autorizada.

## Amenazas prioritarias

- IDOR entre clientes: la propiedad forma parte del `where` de la consulta; no se filtra después.
- Enumeración de cuentas: recuperación responde de forma genérica.
- Doble reserva: restricción única y transacción sobre intervalos.
- Spam: límite por ventana, honeypot y validación de longitud.
- Path traversal: la aplicación genera claves de almacenamiento; nunca acepta rutas del usuario.
- Exposición en analítica: los eventos no incluyen nombres, correos, teléfonos ni descripciones.

## Producción

- Rotar `AUTH_SECRET` y credenciales si existe sospecha de exposición.
- Deshabilitar DEMO y proveedores locales/mock.
- Usar HTTPS, base cifrada, almacenamiento privado y URLs firmadas breves.
- Configurar retención de logs, contactos, citas, documentos y auditoría de acuerdo con la política aprobada.
- Añadir monitoreo de errores sin contenido jurídico sensible.
- Documentar proceso de altas, bajas, suspensión y revisión periódica de accesos.

## Archivos

Permitir únicamente formatos de negocio aprobados, validar magic bytes además del nombre, limitar tamaño y rechazar SVG/HTML. Un archivo visible para cliente requiere autorización explícita; una nota interna nunca debe convertirse automáticamente en actualización pública.

## Aviso de privacidad

La plantilla incluida requiere revisión y aprobación jurídica interna antes de publicarse. Deben confirmarse responsable, domicilio, finalidades, transferencias, ejercicio de derechos ARCO, conservación y proveedores internacionales.

## Reporte de incidentes

Ante un incidente: contener acceso, preservar evidencia, rotar secretos, revisar auditoría, determinar alcance, restaurar desde respaldo y activar el procedimiento interno de notificación aplicable. No registrar el contenido sensible del incidente en canales no autorizados.
