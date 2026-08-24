# Plan final de implementación y lanzamiento controlado

Fecha de corte: 6 de agosto de 2026. Este documento describe el código disponible en el repositorio; no acredita configuraciones ni pruebas en servicios externos.

## 1. Resumen ejecutivo

XS ABOGADOS queda estructurado como una aplicación Next.js monolítica modular para Vercel, con PostgreSQL/Neon mediante Prisma, correo transaccional Brevo, calendario Google, almacenamiento S3 compatible y escaneo antivirus. El endurecimiento local cubre autorización por recurso, MFA, sesiones revocables, cifrado de cargas sensibles, outbox durable, cuarentena documental, sincronización idempotente y CI. El lanzamiento sigue condicionado a provisionar infraestructura, aplicar migraciones en Preview/Production y ejecutar las validaciones externas del runbook.

## 2. Estado inicial encontrado

El proyecto ya incluía sitio institucional, agenda, portales, administración, Prisma, Auth.js y proveedores mock. Los riesgos principales eran: propuestas de cita aceptables por quien las creó, secretos con fallback en Preview, cargas sensibles del outbox en texto legible, sesiones sin inventario revocable, ausencia de MFA real, documentos sin cuarentena/antivirus, sincronización de calendario con poca tolerancia a concurrencia, rate limiting local en despliegues y falta de pruebas de integración/E2E y documentación operativa integral.

## 3. Arquitectura final

- Next.js App Router 16 ejecuta interfaz, Server Components, Route Handlers y Proxy.
- Auth.js gestiona credenciales; Prisma persiste usuarios, perfiles, sesiones y auditoría.
- Neon aporta PostgreSQL pooled para runtime y conexión directa para migraciones.
- Brevo recibe exclusivamente correo transaccional desde un outbox cifrado.
- Google Calendar sincroniza citas confirmadas/canceladas mediante trabajo reintentable.
- S3 compatible conserva objetos privados; ClamAV decide su promoción desde cuarentena.
- Cron autenticado procesa outbox, calendario y documentos.

## 4. Diagrama textual de componentes

```text
Navegador
  -> Vercel / Next.js
       -> Proxy: CSP nonce, request-id, headers, noindex Preview
       -> Auth.js + MFA + UserSession
       -> Políticas por rol, rango, propiedad y asignación
       -> Servicios de dominio
            -> Prisma -> Neon PostgreSQL
            -> EmailOutbox cifrado -> cron -> Brevo
            -> CalendarSync claim/lease -> cron -> Google Calendar
            -> Document quarantine -> ClamAV -> S3 privado
       -> Logs JSON redactados + AuditLog
```

## 5. Mapa de portales

| Superficie      | Prefijo                                                    | Audiencia                  |
| --------------- | ---------------------------------------------------------- | -------------------------- |
| Sitio público   | `/`, `/firma`, `/equipo`, `/areas`, `/insights`, `/agenda` | Público                    |
| Acceso y cuenta | `/portal/iniciar-sesion`, `/portal/seguridad/*`            | Usuarios autenticados      |
| Cliente         | `/portal/panel/*`                                          | `CLIENT` dueño del recurso |
| Abogado         | `/portal/abogado/*`                                        | `LAWYER` asignado          |
| Socio           | `/portal/socio/*`                                          | `LAWYER` + `PARTNER`       |
| Administración  | `/admin/*`                                                 | `ADMIN`                    |

## 6. Matriz de roles y permisos

| Capacidad                           | ADMIN                   | PARTNER                | ASSOCIATE                         | CLIENT             |
| ----------------------------------- | ----------------------- | ---------------------- | --------------------------------- | ------------------ |
| Usuarios globales y auditoría       | Sí                      | No                     | No                                | No                 |
| Clientes/asuntos dentro de política | Sí                      | Sí                     | No                                | Propios, lectura   |
| Asuntos                             | Todos                   | Asignados/supervisados | Solo asignados                    | Solo propios       |
| Nota reservada `INTERNAL_ONLY`      | Sí                      | Sí                     | No                                | No                 |
| Citas/disponibilidad                | Sí                      | Sí                     | Sí                                | Citas propias      |
| Aprobar/publicar artículos          | Sí                      | Sí                     | No                                | No                 |
| Borradores editoriales              | Sí                      | Sí                     | Sí                                | No                 |
| Documentos                          | Por atribución auditada | Asuntos autorizados    | Asuntos asignados, sin reservados | Limpios y visibles |

Las decisiones se centralizan en `src/server/policies` y se vuelven a comprobar dentro de cada lectura/escritura.

## 7. Flujos de autenticación

El login normaliza el correo, hace comparación bcrypt incluso cuando no existe la cuenta, aplica rate limit independiente por red y sujeto, exige estado `ACTIVE`, valida MFA cuando corresponde y crea `UserSession`. Los errores son genéricos. Cookies seguras, `httpOnly` y política de edad absoluta/ociosidad protegen la sesión.

## 8. MFA

TOTP RFC 6238 está implementado con secreto cifrado AES-256-GCM, URI de aprovisionamiento y códigos de recuperación de un solo uso almacenados como HMAC. Es obligatorio para `ADMIN` y `PARTNER`; un asociado puede activarlo. Existen enrolamiento, confirmación y regeneración de códigos. La verificación real con dispositivos debe repetirse en Preview y Production.

## 9. Sesiones

`UserSession` registra expiración, actividad, hash de IP y agente de usuario, nunca la IP en claro. El usuario puede cerrar una sesión o todas las demás; suspensión, cambios sensibles y cierre de sesión invalidan registros. Se comprueban versión de sesión, estado, revocación y timeout ocioso.

## 10. Invitaciones

Las invitaciones se crean con token aleatorio, hash persistido, expiración configurable y uso único. Los scripts de alta no imprimen secretos y separan creación de cuenta del envío transaccional. Revocar invitaciones/sesiones queda auditado.

## 11. Recuperación

La recuperación responde de forma no enumerable, persiste solo el hash del token, expira por tiempo y lo consume una vez. Al cambiar contraseña se incrementa la versión de sesión y se revocan sesiones previas. La contraseña debe tener 12–72 bytes UTF-8 y no pertenecer al conjunto bloqueado.

## 12. Clientes

Los clientes solo consultan su `ClientProfile`, asuntos, citas, notificaciones y recursos relacionados mediante filtros Prisma por propiedad. No reciben identificadores ni DTO internos ajenos. Altas, suspensiones y archivado requieren las capacidades correspondientes.

## 13. Abogados

`LawyerProfile` separa rango `PARTNER`/`ASSOCIATE` del rol técnico. Un asociado accede exclusivamente a asignaciones; el socio amplía capacidades sin poder crear `ADMIN` ni autoescalarse. Cambios de estado o rango deben precederse de revisión de asignaciones activas.

## 14. Asuntos

El modelo conserva folio, cliente, área, prioridad, estado, etapa, descripciones pública/interna, próxima acción, asignaciones y relaciones. Las consultas aplican autorización en `where`; apertura, asignación, actualización y auditoría se ejecutan transaccionalmente cuando comparten invariantes.

## 15. Avances

Los avances distinguen visibilidad pública, interna e interna reservada. El cliente solo recibe elementos publicados y visibles. Cada alta conserva autor/fecha, puede generar notificación prudente y deja auditoría; el historial no se elimina silenciosamente.

## 16. Mensajes

El chat persiste antes de notificar, pagina por cursor con orden estable, limita longitud, evita HTML arbitrario, aplica rate limit e idempotencia mediante UUID del cliente. `CLIENT`/`CLIENT_VISIBLE` llega al cliente; `INTERNAL` queda en el equipo autorizado; `INTERNAL_ONLY` se reserva a socios/administración. El correo no incluye el cuerpo jurídico completo.

## 17. Documentos

La carga autentica y autoriza antes de leer multipart, limita tamaño, valida MIME/extensión/magic bytes/OOXML y calcula SHA-256. El objeto entra en cuarentena y estado `PENDING`; ClamAV lo marca `CLEAN` y lo promueve, o `REJECTED`. Solo un documento limpio, no eliminado y autorizado obtiene descarga o URL firmada breve. Los accesos quedan auditados.

## 18. Citas

El flujo cubre solicitud, revisión, propuestas bilaterales, rechazo, aceptación, confirmación, reprogramación y cancelación. Solo la contraparte puede aceptar una propuesta. Holds y segmentos únicos previenen doble reserva; la aceptación verifica nuevamente disponibilidad y buffer.

## 19. Disponibilidad

Las reglas consideran abogado, zona horaria, duración, modalidad, excepciones, citas y buffers. Producción falla de forma cerrada si no hay reglas válidas; el fallback amplio se limita a desarrollo. La consulta pública devuelve únicamente slots realmente reservables.

## 20. Google Calendar

El proveedor implementa disponibilidad, creación idempotente con ID determinista, actualización y cancelación. Timeouts y errores de `freeBusy` fallan cerrados. `CalendarSync` usa claim/lease, contador de intentos, bloqueo expirable y cron autenticado. No se llamó a Google real durante este trabajo.

## 21. Notificaciones

Las notificaciones pertenecen a un destinatario, admiten deduplicación, lectura y enlaces internos validados. Cada portal consulta solo sus registros. Eventos sensibles envían texto mínimo y apuntan al recurso autorizado.

## 22. Brevo

`BrevoEmailProvider` implementa la interfaz común y envía `to`, `subject`, `text` y `html` con remitente/reply-to configurables. Devuelve `messageId`, aplica timeout, usa sandbox opcional y sanitiza errores. No se realizaron envíos reales.

## 23. Outbox

Los correos se guardan con payload AES-256-GCM, idempotencia y estados `PENDING`, `PROCESSING`, `SENT`, `FAILED` o `DEAD_LETTER`. El procesador reclama atómicamente con lease, recupera bloqueos vencidos, usa backoff acotado y elimina cargas sensibles terminales. ADMIN puede reencolar sin provocar I/O externo durante la acción.

## 24. Editor de artículos

Los abogados elaboran artículos estructurados, con metadatos, autoría e imagen privada/procesada. La validación limita tamaño y contenido; la salida pública se renderiza como componentes, no como HTML arbitrario. Se mantienen SEO, canonical y datos estructurados escapados.

## 25. Flujo editorial

Los estados cubren borrador, enviado, cambios solicitados, aprobado, publicado y archivado según el modelo existente. Un asociado no se aprueba ni publica a sí mismo. Socio/ADMIN revisa, deja decisión auditada y la publicación respeta `ARTICLE_AUTO_PUBLISH_ON_APPROVAL`.

## 26. Auditoría

`AuditLog` registra actor, acción, entidad, metadata minimizada, request ID, hash de IP y agente de usuario. La interfaz es de lectura para ADMIN; no existe operación de edición histórica. Descargas, autenticación, MFA, cambios de cuenta y procesadores dejan evidencia relevante.

## 27. Cifrado

El cifrado de aplicación usa AES-256-GCM con sobre versionado, nonce aleatorio y autenticación. Admite clave actual y anterior para rotación. Se aplica a secretos MFA y payloads de correo; las claves nunca usan `NEXT_PUBLIC_*`. Neon/S3 deben habilitar cifrado administrado en la infraestructura.

## 28. Seguridad web

El Proxy genera nonce CSP por respuesta, request ID y headers contra framing, sniffing y filtración de referencia; HSTS solo se activa en Production. Las mutaciones verifican origen/Sec-Fetch-Site, los redirects aceptan únicamente rutas internas y JSON-LD escapa caracteres ejecutables. Preview y rutas privadas usan `noindex`.

## 29. Rate limiting

Los límites evalúan red y sujeto de manera independiente, con identificadores hasheados mediante salt. `database` es obligatorio en Vercel Preview y Production para compartir estado entre funciones; memoria solo sirve localmente. Cada superficie conserva límites específicos.

## 30. Privacidad

Se minimizan logs, correos y DTO; documentos no viven en `public`; hashes sustituyen IP/tokens; las URLs firmadas expiran. Aviso y términos ya no muestran leyendas provisionales. La retención definitiva requiere aprobación jurídica conforme a la política separada.

## 31. Observabilidad

El logger JSON redacta claves, tokens, contraseñas, cookies, contenido y errores remotos. `/api/health` informa estado mínimo, versión y conectividad, con secreto opcional. Se propagan request IDs. Aún falta conectar alertas/telemetría externa aprobada.

## 32. Backups

Antes de migrar Production: backup lógico verificable y PITR/retención de Neon activados. S3 requiere versionado, lifecycle y protección contra borrado. La existencia del backup no basta: se debe ensayar restauración en un proyecto aislado y conservar evidencia.

## 33. Recuperación ante desastres

Orden: contener tráfico, preservar evidencia, rotar secretos afectados, restaurar datos/objetos a un entorno aislado, verificar integridad y migraciones, probar portales y solo entonces conmutar. Definir RTO/RPO, responsables y canales fuera de banda antes del lanzamiento.

## 34. Pruebas

Localmente pasaron 99 unitarias, 2 de integración PostgreSQL y 8 E2E Chromium desktop/móvil, además de lint, typecheck, Prisma, migraciones y build. Cobertura porcentual no está configurada. Brevo, Neon, Google, S3 y ClamAV reales quedan pendientes; consultar `TEST_REPORT.md`.

## 35. CI/CD

GitHub Actions usa Node 22, PostgreSQL de servicio, `npm ci`, auditoría, Prisma, migraciones, formato, lint, tipos, unitarias, integración, build, Playwright y secretos. CodeQL y Dependabot están definidos. La rama principal debe protegerse y exigir estos checks.

## 36. Migraciones

Cuatro migraciones se aplicaron en orden sobre PostgreSQL local desechable con `prisma migrate deploy`. La migración de hardening añade/backfillea antes de endurecer nulabilidad e incorpora índices; no ejecuta seed. Para Neon se usa `DIRECT_URL`, ventana controlada, backup y verificación posterior.

## 37. Despliegue Preview

Crear Neon/S3/calendario/remitente de prueba separados, cargar secretos exclusivos, aplicar `db:deploy`, desplegar y ejecutar smoke + E2E. Preview puede usar calendario mock y demo solo con flags explícitos; correo/DB pueden ser reales de prueba. Nunca copiar expedientes reales.

## 38. Despliegue Production

Requiere aprobación del Preview, backup, variables de Production distintas, calendario Google, S3 y scanner operativos, rate limit database, demo/seed desactivados y crons autenticados. Aplicar migraciones como paso deliberado antes del deploy compatible. Seguir literalmente `DEPLOYMENT_RUNBOOK.md`.

## 39. Rollback

No usar `migrate reset`. Para fallo de aplicación, redeploy del artefacto anterior compatible y detener procesadores si agravan el incidente. Para datos, usar restauración a proyecto Neon nuevo o procedimiento aprobado; las migraciones aditivas se mantienen y su retirada se planifica después.

## 40. Validación posterior al lanzamiento

Comprobar HTTPS/canonical/robots, login+MFA, revocación, IDOR, agenda concurrida, Brevo, calendar sync, cuarentena/descarga, portales, auditoría, health, cron, logs y backups. Registrar evidencia, hora, responsable y resultado.

## 41. Operación diaria

Revisar outbox muerto, calendar sync fallido, documentos pendientes, health, alertas, auditoría anómala y expiración de credenciales. Las reejecuciones administrativas deben conservar idempotencia y dejar auditoría.

## 42. Mantenimiento

Actualizar dependencias en ramas, ejecutar la suite completa, rotar claves/API, revisar permisos/usuarios inactivos, ensayar restauraciones, verificar políticas de lifecycle y revisar CSP/orígenes. No mezclar una rotación con una migración irreversible.

## 43. Riesgos restantes

- Integraciones reales y límites operativos no se validaron.
- El buffering multipart sigue sujeto al límite de la función; cargas mayores requieren subida directa presignada con confirmación servidor.
- No existe cobertura porcentual ni pruebas E2E autenticadas de cada rol contra fixtures completos.
- Retención, RTO/RPO, observabilidad externa y eliminación legal necesitan decisión institucional.
- Los enums de visibilidad conservan alias por compatibilidad; una futura migración puede normalizarlos tras verificar datos.

## 44. Trabajo externo pendiente

Provisionar/validar Vercel, Neon, Brevo, Google, S3 y ClamAV; configurar DNS, SPF, DKIM y DMARC; crear secretos y crons; hacer backup/restauración; ejecutar migraciones Preview/Production; crear primer ADMIN y MFA; cargar contenido real autorizado; activar alertas; revisar accesibilidad humana y dispositivos reales.

## 45. Checklist de lanzamiento

- [ ] Todos los responsables y ventana aprobados.
- [ ] Preview aislado, migrado y probado con E2E autenticado.
- [ ] Backup y restauración ensayados.
- [ ] Variables cotejadas con `ENVIRONMENT_VARIABLES.md`.
- [ ] MFA habilitado para ADMIN y socios.
- [ ] Brevo, Google, S3, ClamAV y crons validados con recursos de prueba.
- [ ] DNS/correo autenticado y observabilidad activa.
- [ ] Migraciones Production aplicadas sin seed.
- [ ] Smoke tests y controles IDOR aprobados.
- [ ] Rollback y guardia posterior al lanzamiento confirmados.

Documentos operativos: [variables](./ENVIRONMENT_VARIABLES.md), [seguridad](./SECURITY_HARDENING.md), [datos](./DATA_CLASSIFICATION_AND_RETENTION.md), [runbook](./DEPLOYMENT_RUNBOOK.md), [pruebas](./TEST_REPORT.md) y [checklist](./PRODUCTION_CHECKLIST.md).
