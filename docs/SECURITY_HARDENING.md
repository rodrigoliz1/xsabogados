# Endurecimiento de seguridad

Estado al 6 de agosto de 2026. Alcance: código local y pruebas locales. La eficacia final depende de la configuración real de Vercel, Neon, Brevo, Google, S3, ClamAV, DNS y observabilidad.

## Threat model

### Activos

- Identidades, contraseñas, secretos MFA, códigos de recuperación y sesiones.
- Expedientes, descripciones, avances, mensajes, documentos y metadatos jurídicos.
- Citas, disponibilidad y tokens de gestión.
- Artículos en borrador, decisiones editoriales y medios.
- Credenciales/API keys, cargas del outbox, logs y auditoría.
- Integridad/disponibilidad de PostgreSQL, objetos y calendario.

### Actores

- Visitante anónimo, cliente, asociado, socio y administrador legítimos.
- Cuenta comprometida o usuario interno que excede sus atribuciones.
- Bot de abuso, atacante de Internet y proveedor externo comprometido.
- Operador con acceso a Vercel/Neon/S3 o al repositorio.

### Fronteras de confianza

```text
Internet -> Proxy/Next.js -> autenticación/autorización -> servicios -> PostgreSQL
                                                \-> Brevo
                                                \-> Google Calendar
                                                \-> S3 <-> ClamAV
CI/GitHub -> artefacto -> Vercel
Operadores -> paneles de proveedor y secretos
```

Todo dato procedente del navegador, webhooks inexistentes, cabeceras proxy, proveedor, archivo o base se considera no confiable hasta validarlo.

### Superficies de ataque

- Login, recuperación, activación, MFA y revocación de sesiones.
- Formularios públicos y tokens de gestión de citas.
- APIs/Server Actions de portales y administración; riesgo IDOR/BOLA.
- Mensajes, editor, búsquedas, redirects y JSON-LD; XSS/HTML/URL insegura.
- Multipart, OOXML, descargas y URL firmadas; malware, polyglot y path traversal.
- Outbox, crons y APIs externas; replay, duplicación, bloqueo huérfano y SSRF.
- Variables, logs, source maps, dependencias, CI y repositorio público.

## Controles implementados

### Identidad y cuenta

- Bcrypt con comparación ficticia para reducir enumeración temporal.
- Política de 12–72 bytes UTF-8 y bloqueo de contraseñas comunes.
- MFA TOTP real; obligatorio para ADMIN/PARTNER; secreto cifrado.
- Códigos de recuperación HMAC, uso único y regenerables.
- Sesiones persistidas con edad absoluta, timeout ocioso, revocación y versión.
- Invitación/recuperación con token aleatorio, hash, expiración y consumo único.
- Respuestas genéricas y rate limit independiente por red/sujeto.

### Autorización e IDOR

- Políticas centralizadas por rol, rango, propiedad, asignación y capacidad.
- Consultas Prisma restringidas desde `where`; no se confía en filtros cliente.
- `CLIENT` ve solo recursos propios y contenido `CLIENT`/`CLIENT_VISIBLE` publicado.
- `ASSOCIATE` ve solo asuntos asignados y no contenido `INTERNAL_ONLY`.
- `PARTNER`/ADMIN pueden consultar y crear notas reservadas dentro de su ámbito.
- Descargas, media, citas, artículos y acciones administrativas revalidan acceso.

### Aplicación web

- CSP por respuesta con nonce, `object-src 'none'`, anti-frame y restricciones de base/form.
- HSTS únicamente en `VERCEL_ENV=production`, `nosniff`, Referrer y Permissions Policy.
- Verificación Same-Origin y `Sec-Fetch-Site` en mutaciones.
- Redirects limitados a rutas internas; JSON-LD serializado con caracteres escapados.
- Zod, límites de cuerpo/longitud, honeypot y salida React escapada.
- Preview y portales privados con `noindex`; errores no exponen stack en producción.

### Datos, archivos y proveedores

- AES-256-GCM versionado para secretos MFA y payloads del outbox.
- Tokens se persisten como hash; IP se persiste como hash con salt.
- Documentos fuera de `public`, claves opacas, cuarentena y checksum SHA-256.
- Inspección MIME/extensión/magic bytes/OOXML y ClamAV antes de descarga.
- S3 exige HTTPS en Production, firma SigV4, timeout, SSE y URL breve.
- Outbox/calendar/documentos usan claim/lease e idempotencia; crons tienen secreto.
- Logs JSON redactan claves, tokens, passwords, cookies, cuerpos sensibles y respuestas remotas.

## Matriz de riesgos y estado

| Riesgo              | Control                                       | Estado local                       | Riesgo residual                                      |
| ------------------- | --------------------------------------------- | ---------------------------------- | ---------------------------------------------------- |
| Credential stuffing | bcrypt, respuesta genérica, rate limit, MFA   | Implementado/probado unitariamente | Capacidad real depende de Neon y alertas             |
| Robo de sesión      | cookies, idle/absolute, DB revocation, MFA    | Implementado                       | Compromiso de dispositivo sigue siendo posible       |
| IDOR                | filtros Prisma y políticas                    | Pruebas de matriz básicas          | Falta suite E2E autenticada completa por rol         |
| XSS/open redirect   | React, CSP nonce, URL interna, JSON-LD seguro | Implementado/probado               | CSP debe observarse en Vercel y con terceros reales  |
| Doble reserva       | holds, segmentos únicos, revalidación         | Implementado                       | Requiere carga/concurrencia contra Neon Preview      |
| Fuga de correo      | payload cifrado y scrub terminal              | Implementado                       | Metadatos mínimos permanecen por operación/auditoría |
| Malware             | cuarentena, inspección y scanner              | Implementado con mock/unitarias    | ClamAV real no probado                               |
| Exposición S3       | bucket privado, firma, SSE, autorización      | Implementado/unitario              | IAM/bucket reales no probados                        |
| Abuso de proveedor  | timeout, backoff, idempotencia, dead letter   | Implementado                       | Cuotas reales y respuestas límite no probadas        |
| Pérdida de datos    | runbook de backup/restore                     | Documentado                        | Restore real no ensayado                             |

## MFA y rotación de claves

- `AUTH_SECRET`: crear uno nuevo, desplegar en ventana y revocar todas las sesiones; una rotación invalida cookies.
- `DATA_ENCRYPTION_KEY_CURRENT`: introducir nueva versión conservando `PREVIOUS`; verificar descifrado y recifrar/agotar registros antes de retirar.
- `MFA_RECOVERY_CODE_PEPPER`: su rotación invalida códigos existentes; exigir regeneración y conservar procedimiento de recuperación verificada.
- Brevo/Google/S3/cron/health/rate salt: crear credencial nueva con privilegio mínimo, desplegar, probar y luego revocar anterior.
- Toda rotación debe registrar responsable, motivo, hora, secreto afectado (nunca su valor), evidencia y resultado.

## Política de logs

Permitido: request ID, entorno, versión, acción, tipo/ID opaco de entidad, latencia, estado y código genérico. Prohibido: contraseña, OTP, recuperación, invitación, token de gestión, cookie, Authorization, API key, documento, cuerpo de mensaje, estrategia jurídica, connection string o respuesta completa del proveedor. La retención y acceso al agregador requieren aprobación. En incidente, preservar evidencia sin copiar contenido sensible a canales no autorizados.

## Pruebas IDOR obligatorias

Antes del lanzamiento, automatizar y ejecutar con fixtures independientes:

- Cliente A no puede leer/escribir asunto, cita, mensaje, notificación, documento ni media de Cliente B.
- Asociado A no puede enumerar asuntos no asignados ni `INTERNAL_ONLY`.
- Socio no puede escalar a ADMIN ni administrar perfiles fuera de la política.
- Usuario suspendido/sesión revocada no puede reutilizar cookie ni URL firmada nueva.
- Cambiar IDs válidos por otros debe producir 404/403 genérico sin metadatos.
- Cursor, filtro, exportación, ICS, download y rutas anidadas deben mantener pertenencia.

Las unitarias actuales cubren la matriz central; falta completar esta batería autenticada E2E contra Preview.

## Checklist OWASP ASVS/Top 10 adaptado

- [x] Control de acceso server-side y denegación por defecto.
- [x] Protección criptográfica de secretos de aplicación y tokens hasheados.
- [x] Validación de entrada/salida y ausencia de HTML arbitrario.
- [x] Diseño con estados, transacciones, idempotencia y auditoría.
- [x] Configuración falla cerrada en Production.
- [x] Auditoría local de dependencias y actualización automatizada.
- [x] Identificación/autenticación con MFA y sesión revocable.
- [x] Integridad de objetos por checksum y scanner antes de servir.
- [x] Logs redactados, health y request IDs.
- [ ] Alertas externas, SIEM y playbooks ensayados.
- [ ] Pentest/DAST y E2E IDOR completos en Preview.
- [ ] Revisión IAM, DNS, CSP y TLS en infraestructura real.

## Dependencias y cadena de suministro

- Lockfile obligatorio y `npm ci` en CI.
- `npm audit` no debe ignorar criticidad alta/crítica.
- Dependabot propone actualizaciones; CodeQL y ESLint ejecutan análisis estático.
- Rama principal protegida, revisión obligatoria y secretos de CI con mínimo alcance.
- No ejecutar scripts de paquetes nuevos sin revisión; probar upgrades de Auth/Next/Prisma en Preview.

## Archivos y eliminación

No se almacenan documentos en `public`. La eliminación lógica usa `deletedAt`; un proceso autorizado debe eliminar después el objeto y registrar evidencia. Para material infectado, conservar solo los metadatos mínimos necesarios y purgar la cuarentena según política. No incluir `.env`, `.data`, source maps privados, `*.tsbuildinfo`, dumps ni evidencias en Git.

## Procedimiento de incidente

1. Designar coordinador, abrir registro fuera del sistema afectado y clasificar severidad.
2. Contener: revocar sesiones/API keys, pausar crons o bloquear rutas sin destruir evidencia.
3. Preservar logs/auditoría/backups con control de acceso y hash.
4. Determinar actores, datos, periodo, proveedores y obligaciones de notificación.
5. Erradicar causa, rotar secretos y corregir configuración/código.
6. Restaurar en entorno aislado; comprobar migraciones, checksums y permisos.
7. Reabrir gradualmente, monitorizar y comunicar por el procedimiento jurídico aprobado.
8. Elaborar postmortem sin secretos ni datos innecesarios y dar seguimiento.

## Riesgos residuales y condiciones de producción

No se declara la plataforma “lista para producción” hasta validar proveedores reales, IAM, backup/restore, alertas, dominio/correo, ClamAV, Google, crons y E2E autenticado por rol. El detalle operativo está en [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md) y la clasificación/retención en [DATA_CLASSIFICATION_AND_RETENTION.md](./DATA_CLASSIFICATION_AND_RETENTION.md).
