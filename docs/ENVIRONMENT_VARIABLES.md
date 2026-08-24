# Variables de entorno

Inventario con corte al 6 de agosto de 2026. Los ejemplos son ficticios. Configure Development/Test en un `.env` local ignorado o en el runner; Preview/Production en Vercel, con valores distintos. Nunca copie secretos a variables `NEXT_PUBLIC_*`.

## Leyenda

- Requerimiento `S`: obligatorio; `C`: condicional al proveedor/flujo; `O`: opcional; `A`: inyectado automáticamente.
- Entornos: D = Development, T = Test/CI, V = Vercel Preview, P = Vercel Production.
- En “efecto”, `bloquea` significa que la validación falla cerrada; `degrada` deshabilita o usa el valor seguro indicado.
- Todo cambio en Vercel requiere redeploy salvo secretos consumidos únicamente por un proceso CLI externo; la aplicación no debe exponer ningún secreto al cliente.

## Sitio, plataforma y autenticación

| Variable                        | Propósito / clase                                          | D/T/V/P | Formato y ejemplo ficticio           | Origen, configuración y rotación                                             | Si falta / redeploy / cliente                                    |
| ------------------------------- | ---------------------------------------------------------- | ------- | ------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `NODE_ENV`                      | Modo de Node; pública operativa                            | A/A/A/A | `development`, `test`, `production`  | Node/Vercel; no rotar ni fijar manualmente en Vercel                         | Cambia defaults; redeploy; no se envía directamente              |
| `VERCEL_ENV`                    | Distingue Preview de Production; pública operativa         | O/O/A/A | `preview`                            | Vercel                                                                       | Local se considera no Vercel; automático; no cliente             |
| `VERCEL_URL`                    | Host del deployment; pública operativa                     | O/O/A/A | `xs-git-main-acme.vercel.app`        | Vercel                                                                       | Se usa otro origen permitido; automático; no cliente             |
| `VERCEL_PROJECT_PRODUCTION_URL` | Host estable del proyecto; pública operativa               | O/O/A/A | `xs-abogados.vercel.app`             | Vercel                                                                       | Se usa URL explícita; automático; no cliente                     |
| `NEXT_PUBLIC_SITE_URL`          | URL canonical y enlaces; pública                           | C/C/C/S | URL HTTPS, `https://xs-abogados.com` | Dominio aprobado; Vercel por entorno; cambiar al migrar dominio              | Inferencia en Preview, incorrecto en P; redeploy; **sí** cliente |
| `AUTH_SECRET`                   | Firma/cifrado de Auth.js; **secreta**                      | O/C/S/S | >=32 caracteres aleatorios           | Gestor criptográfico; Vercel Secret; rotar con cierre de sesiones coordinado | Bloquea V/P; redeploy; nunca cliente                             |
| `AUTH_URL`                      | Origen Auth.js; pública operativa                          | O/O/C/C | URL HTTPS                            | Dominio del entorno; Vercel                                                  | Inferencia posible; redeploy; no cliente                         |
| `NEXTAUTH_URL`                  | Alias de compatibilidad Auth.js; pública operativa         | O/O/O/O | URL HTTPS                            | Igual que `AUTH_URL`; retirar cuando se confirme compatibilidad              | Inferencia; redeploy; no cliente                                 |
| `AUTH_TRUST_HOST`               | Confianza explícita del host; pública operativa            | O/O/O/O | `true`/`false`                       | Solo infraestructura conocida; Vercel                                        | Vercel se detecta; redeploy; no cliente                          |
| `SESSION_MAX_AGE_SECONDS`       | Edad absoluta; pública operativa                           | O/O/O/O | entero, `28800`                      | Política interna; Vercel                                                     | Default 8 h; redeploy; no cliente                                |
| `SESSION_IDLE_TIMEOUT_SECONDS`  | Inactividad máxima; pública operativa                      | O/O/O/O | entero, `3600`                       | Política interna; Vercel                                                     | Default 1 h; redeploy; no cliente                                |
| `MFA_ISSUER`                    | Nombre visible TOTP; pública                               | O/O/O/O | texto, `XS ABOGADOS`                 | Marca; Vercel                                                                | Usa XS ABOGADOS; redeploy; puede verse en autenticador           |
| `MFA_RECOVERY_CODE_PEPPER`      | HMAC de códigos; **secreta**                               | O/C/S/S | >=32 caracteres aleatorios           | Gestor criptográfico; Vercel Secret; rotar regenerando códigos               | Bloquea MFA desplegado; redeploy; nunca cliente                  |
| `ENABLE_DEMO_AUTH`              | Permite cuentas demo solo local/Preview; pública operativa | O/O/O/S | `false`                              | Configuración de entorno                                                     | Default false y bloqueada en P; redeploy; no cliente             |
| `ALLOW_DATABASE_SEED`           | Guardia del seed; pública operativa                        | O/C/O/S | `false`                              | Shell/Vercel; nunca true en P                                                | Seed no corre; redeploy no necesario para CLI; no cliente        |
| `DEMO_ADMIN_PASSWORD`           | Password seed demo; **secreta**                            | C/C/C/O | texto aleatorio                      | Solo entorno efímero; eliminar después de seed                               | Seed falla; no redeploy si solo CLI; nunca cliente               |
| `DEMO_CLIENT_PASSWORD`          | Password seed demo; **secreta**                            | C/C/C/O | texto aleatorio                      | Igual anterior                                                               | Seed falla; no cliente                                           |
| `DEMO_LAWYER_PASSWORD`          | Password seed demo; **secreta**                            | C/C/C/O | texto aleatorio                      | Igual anterior                                                               | Seed falla; no cliente                                           |
| `ADMIN_INITIAL_PASSWORD`        | Bootstrap CLI `admin:create`; **secreta y efímera**        | C/O/C/C | 12–72 bytes                          | Generar para una ejecución, configurar en shell y retirar                    | CLI falla; no redeploy; nunca cliente                            |

## PostgreSQL, cifrado y rate limiting

| Variable                               | Propósito / clase                         | D/T/V/P | Formato y ejemplo ficticio                                | Origen, configuración y rotación                             | Si falta / redeploy / cliente                                      |
| -------------------------------------- | ----------------------------------------- | ------- | --------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL`                         | Prisma runtime pooled; **secreta**        | O/S/S/S | PostgreSQL URI `postgresql://u:p@host/db?sslmode=require` | Neon pooled; Vercel/CI; rotar credencial y redeploy          | Memoria solo local; bloquea desplegado; nunca cliente              |
| `DIRECT_URL`                           | Migraciones directas; **secreta**         | O/S/S/S | PostgreSQL URI no pooler                                  | Neon direct; shell de migración + Vercel si build lo valida  | `db:deploy` falla; redeploy para runtime validation; nunca cliente |
| `TEST_DATABASE_URL`                    | DB desechable de integración; **secreta** | O/S/O/O | PostgreSQL local con nombre que incluya `test`            | Runner/localhost; destruir al terminar                       | La suite se niega a correr; no redeploy; nunca cliente             |
| `DATA_ENCRYPTION_KEY_VERSION`          | Versión del sobre; pública operativa      | O/O/S/S | `v1`                                                      | Convención interna; Vercel                                   | Default v1; redeploy; no cliente                                   |
| `DATA_ENCRYPTION_KEY_CURRENT`          | AES-256-GCM actual; **secreta**           | O/C/S/S | base64 de 32 bytes                                        | CSPRNG/secret manager; Vercel Secret                         | Bloquea datos cifrados desplegados; redeploy; nunca cliente        |
| `DATA_ENCRYPTION_KEY_PREVIOUS_VERSION` | Versión anterior; pública operativa       | O/O/C/C | `v0`                                                      | Mantener durante rotación                                    | Solo cargas antiguas afectadas; redeploy; no cliente               |
| `DATA_ENCRYPTION_KEY_PREVIOUS`         | AES anterior; **secreta**                 | O/O/C/C | base64 de 32 bytes                                        | Secret manager; retirar tras recifrado verificado            | No descifra versión previa; redeploy; nunca cliente                |
| `RATE_LIMIT_PROVIDER`                  | Backend de límites; pública operativa     | O/O/C/S | `memory`/`database`                                       | Política de entorno; Vercel                                  | Auto database si hay DB; memory bloqueada en P; redeploy           |
| `RATE_LIMIT_SALT`                      | Hash de red/sujeto; **secreta**           | O/C/S/S | >=32 caracteres                                           | CSPRNG; Vercel Secret; rotar al cambio de ventana/privacidad | Bloquea P; redeploy; nunca cliente                                 |
| `TRUST_PROXY_HEADERS`                  | Confía IP de proxy; pública operativa     | O/O/O/O | `false`                                                   | Solo proxy conocido; Vercel ya se detecta                    | IP menos precisa; redeploy; no cliente                             |

## Correo transaccional y outbox

| Variable                       | Propósito / clase                        | D/T/V/P | Formato y ejemplo ficticio | Origen, configuración y rotación                        | Si falta / redeploy / cliente                                    |
| ------------------------------ | ---------------------------------------- | ------- | -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `EMAIL_PROVIDER`               | Proveedor; pública operativa             | O/O/S/S | `mock`/`brevo`/`resend`    | Configuración Vercel                                    | Default mock local; Brevo recomendado en P; redeploy             |
| `BREVO_API_KEY`                | API transaccional; **secreta**           | C/O/C/S | `xkeysib-…` ficticio       | Brevo API Keys; Vercel Secret; revocar/crear y redeploy | Brevo bloqueado; nunca cliente                                   |
| `EMAIL_FROM_ADDRESS`           | Remitente verificado; pública            | C/O/C/S | email                      | Brevo sender/domain; Vercel                             | Brevo bloqueado; redeploy; visible al destinatario               |
| `EMAIL_FROM_NAME`              | Nombre remitente; pública                | C/O/C/S | `XS ABOGADOS`              | Marca; Vercel                                           | Brevo bloqueado; redeploy; visible                               |
| `EMAIL_REPLY_TO`               | Respuesta opcional; pública              | O/O/O/O | email                      | Bandeja institucional; Vercel                           | Se omite; redeploy; visible                                      |
| `CONTACT_RECIPIENT_EMAIL`      | Bandeja del despacho; interna            | O/O/S/S | email                      | Administración de correo; Vercel                        | Usa fallback institucional; redeploy; no se entrega al navegador |
| `BREVO_SANDBOX_MODE`           | Sandbox transaccional; pública operativa | O/O/O/S | `true`/`false`             | Brevo/Vercel; false en P                                | Default false; redeploy; no cliente                              |
| `RESEND_API_KEY`               | API heredada; **secreta**                | O/O/C/C | clave de Resend            | Resend/Vercel Secret; compatibilidad transitoria        | Resend bloqueado; nunca cliente                                  |
| `EMAIL_FROM`                   | Remitente heredado; pública              | O/O/C/C | nombre y email             | Remitente verificado de Resend                          | Resend bloqueado; redeploy; visible                              |
| `EMAIL_CRON_SECRET`            | Autoriza cron outbox; **secreta**        | O/O/S/S | >=32 caracteres            | CSPRNG; Vercel Cron/Secret                              | Procesador bloqueado; redeploy; nunca cliente                    |
| `EMAIL_OUTBOX_MAX_ATTEMPTS`    | Límite de intentos                       | O/O/O/O | `5`                        | Política operativa; Vercel                              | Default 5; redeploy                                              |
| `EMAIL_OUTBOX_BASE_DELAY_MS`   | Backoff base                             | O/O/O/O | `60000`                    | Política operativa                                      | Default; redeploy                                                |
| `EMAIL_OUTBOX_MAX_DELAY_MS`    | Backoff máximo                           | O/O/O/O | `3600000`                  | Política operativa                                      | Default; redeploy                                                |
| `EMAIL_OUTBOX_LOCK_TIMEOUT_MS` | Lease                                    | O/O/O/O | `120000`                   | Mayor al timeout Brevo                                  | Default; redeploy                                                |
| `EMAIL_OUTBOX_BATCH_SIZE`      | Tamaño batch                             | O/O/O/O | `25`                       | Ajustar con métricas                                    | Default; redeploy                                                |

## Calendario, citas y negocio

| Variable                            | Propósito / clase                       | D/T/V/P | Formato y ejemplo ficticio    | Origen, configuración y rotación                   | Si falta / redeploy / cliente                  |
| ----------------------------------- | --------------------------------------- | ------- | ----------------------------- | -------------------------------------------------- | ---------------------------------------------- |
| `CALENDAR_PROVIDER`                 | Proveedor servidor                      | O/O/S/S | `mock`/`google`               | Vercel; P=`google`                                 | Mock local/Preview; bloquea P; redeploy        |
| `NEXT_PUBLIC_CALENDAR_PROVIDER`     | Indicador de UI; pública                | O/O/S/S | `mock`/`google`               | Igual al servidor; Vercel                          | UI incoherente; redeploy; **sí** cliente       |
| `GOOGLE_CLIENT_ID`                  | OAuth; identificador sensible operativo | C/O/C/S | `…apps.googleusercontent.com` | Google Cloud; Vercel                               | Google bloqueado; redeploy; no cliente         |
| `GOOGLE_CLIENT_SECRET`              | OAuth; **secreta**                      | C/O/C/S | cadena                        | Google Cloud; rotar credencial y redeploy          | Google bloqueado; nunca cliente                |
| `GOOGLE_REFRESH_TOKEN`              | Acceso calendario; **secreta**          | C/O/C/S | token OAuth                   | Consentimiento cuenta técnica; revocar/reautorizar | Sync bloqueada; redeploy; nunca cliente        |
| `GOOGLE_CALENDAR_ID`                | Calendario destino; interna             | C/O/C/S | email/ID                      | Google Calendar                                    | Sync bloqueada; redeploy; no cliente           |
| `CALENDAR_SYNC_CRON_SECRET`         | Autoriza cron; **secreta**              | O/O/S/S | >=32 caracteres               | CSPRNG; Vercel                                     | Reintentos bloqueados; redeploy; nunca cliente |
| `CALENDAR_SYNC_BATCH_SIZE`          | Batch                                   | O/O/O/O | `20`                          | Operación                                          | Default; redeploy                              |
| `CALENDAR_SYNC_LOCK_TIMEOUT_MS`     | Lease                                   | O/O/O/O | `120000`                      | Mayor al timeout API                               | Default; redeploy                              |
| `CALENDAR_SYNC_MAX_ATTEMPTS`        | Intentos máximos                        | O/O/O/O | `8`                           | Operación                                          | Default; redeploy                              |
| `APPOINTMENT_HOLD_MINUTES`          | Duración del hold                       | O/O/O/O | `20`                          | Política de agenda                                 | Default; redeploy                              |
| `APPOINTMENT_MANAGE_TOKEN_TTL_DAYS` | Token público de gestión                | O/O/O/O | `30`                          | Política de privacidad                             | Default; redeploy                              |
| `ACCOUNT_INVITE_EXPIRY_HOURS`       | Invitación                              | O/O/O/O | `48`                          | Política de cuentas                                | Default; redeploy                              |
| `PASSWORD_RESET_EXPIRY_MINUTES`     | Recuperación                            | O/O/O/O | `30`                          | Política de cuentas                                | Default; redeploy                              |
| `MESSAGE_EMAIL_COOLDOWN_MINUTES`    | Agrupa avisos de chat                   | O/O/O/O | `5`                           | Operación                                          | Default; redeploy                              |
| `ARTICLE_AUTO_PUBLISH_ON_APPROVAL`  | Publicación tras aprobación             | O/O/O/O | `true`/`false`                | Política editorial                                 | Default true; redeploy                         |
| `MAX_ARTICLE_IMAGE_MB`              | Límite de imagen                        | O/O/O/O | `10`                          | Seguridad/rendimiento                              | Default; redeploy                              |
| `ARTICLE_IMAGE_MAX_WIDTH`           | Redimensionado                          | O/O/O/O | `2000`                        | Rendimiento                                        | Default; redeploy                              |

## Almacenamiento y antivirus

| Variable                                 | Propósito / clase                          | D/T/V/P | Formato y ejemplo ficticio | Origen, configuración y rotación     | Si falta / redeploy / cliente                             |
| ---------------------------------------- | ------------------------------------------ | ------- | -------------------------- | ------------------------------------ | --------------------------------------------------------- |
| `STORAGE_PROVIDER`                       | Backend de objetos                         | O/O/S/S | `local`/`s3`               | Vercel desplegado=`s3`               | Local solo desarrollo/prueba local; bloquea V/P; redeploy |
| `PRIVATE_UPLOAD_DIR`                     | Carpeta local ignorada                     | C/C/C/O | `.data/uploads`            | Filesystem local                     | Default; no persistente en Vercel; no cliente             |
| `S3_ENDPOINT`                            | API S3 HTTPS                               | C/O/C/S | `https://s3.example.test`  | Proveedor S3                         | S3 bloqueado; redeploy; no cliente                        |
| `S3_REGION`                              | Región                                     | C/O/C/S | `us-east-1`                | Proveedor S3                         | S3 bloqueado; redeploy                                    |
| `S3_BUCKET`                              | Bucket privado                             | C/O/C/S | `xs-private-prod`          | Proveedor S3                         | S3 bloqueado; redeploy                                    |
| `S3_ACCESS_KEY_ID`                       | Credencial; **secreta**                    | C/O/C/S | `AKIA…` ficticio           | IAM mínimo; Vercel; rotar par        | S3 bloqueado; redeploy; nunca cliente                     |
| `S3_SECRET_ACCESS_KEY`                   | Credencial; **secreta**                    | C/O/C/S | cadena                     | IAM; Vercel Secret                   | S3 bloqueado; redeploy; nunca cliente                     |
| `S3_SESSION_TOKEN`                       | Sesión temporal; **secreta**               | O/O/C/C | token STS                  | IAM/STS; renovar antes de expirar    | Solo credencial temporal; redeploy; nunca cliente         |
| `AWS_SESSION_TOKEN`                      | Alias compatible del anterior; **secreta** | O/O/O/O | token STS                  | IAM/STS; preferir `S3_SESSION_TOKEN` | Se ignora si no se necesita; redeploy; nunca cliente      |
| `S3_REQUEST_TIMEOUT_MS`                  | Timeout                                    | O/O/O/O | `12000`                    | Operación                            | Default; redeploy                                         |
| `S3_SERVER_SIDE_ENCRYPTION`              | SSE                                        | O/O/C/S | `AES256`/`aws:kms`         | Política del bucket                  | Default AES256; KMS exige key; redeploy                   |
| `S3_KMS_KEY_ID`                          | Llave KMS; **sensible**                    | O/O/C/C | ARN/ID                     | KMS; rotación administrada           | Requerida con `aws:kms`; redeploy; nunca cliente          |
| `S3_SSE_KMS_KEY_ID`                      | Alias compatible KMS; **sensible**         | O/O/O/O | ARN/ID                     | Preferir `S3_KMS_KEY_ID`             | Igual anterior; redeploy; nunca cliente                   |
| `DOCUMENT_MAX_UPLOAD_BYTES`              | Tamaño máximo                              | O/O/O/O | `10485760`                 | Seguridad                            | Default acotado; redeploy                                 |
| `DOCUMENT_UPLOAD_RATE_LIMIT_MAX`         | Cargas/ventana                             | O/O/O/O | `10`                       | Seguridad                            | Default; redeploy                                         |
| `DOCUMENT_UPLOAD_RATE_LIMIT_WINDOW_MS`   | Ventana de carga                           | O/O/O/O | `60000`                    | Seguridad                            | Default; redeploy                                         |
| `DOCUMENT_DOWNLOAD_RATE_LIMIT_MAX`       | Descargas/ventana                          | O/O/O/O | `120`                      | Seguridad                            | Default; redeploy                                         |
| `DOCUMENT_DOWNLOAD_RATE_LIMIT_WINDOW_MS` | Ventana descarga                           | O/O/O/O | `60000`                    | Seguridad                            | Default; redeploy                                         |
| `DOCUMENT_DOWNLOAD_URL_TTL_SECONDS`      | Vigencia URL firmada                       | O/O/O/O | `300`                      | Seguridad                            | Default acotado; redeploy                                 |
| `FILE_SCANNER_PROVIDER`                  | Scanner                                    | O/O/S/S | `mock`/`clamav`            | Vercel; P=`clamav`                   | Mock solo no P; bloquea promoción; redeploy               |
| `CLAMAV_HOST`                            | Host scanner                               | C/O/C/S | hostname privado           | Infraestructura antivirus            | ClamAV bloqueado; redeploy                                |
| `CLAMAV_PORT`                            | Puerto scanner                             | C/O/C/S | `3310`                     | Infraestructura                      | Default 3310; redeploy                                    |
| `FILE_SCAN_TIMEOUT_MS`                   | Timeout                                    | O/O/O/O | `15000`                    | Operación                            | Default; redeploy                                         |
| `FILE_SCAN_LOCK_TIMEOUT_MS`              | Lease                                      | O/O/O/O | `300000`                   | Operación                            | Default; redeploy                                         |
| `FILE_SCAN_BATCH_SIZE`                   | Batch                                      | O/O/O/O | `10`                       | Operación                            | Default; redeploy                                         |
| `FILE_SCAN_CRON_SECRET`                  | Autoriza cron; **secreta**                 | O/O/S/S | >=32 caracteres            | CSPRNG; Vercel                       | Escaneo diferido bloqueado; redeploy; nunca cliente       |

## Observabilidad, datos públicos y pruebas

| Variable                       | Propósito / clase                     | D/T/V/P | Formato y ejemplo ficticio    | Origen, configuración y rotación | Si falta / redeploy / cliente                               |
| ------------------------------ | ------------------------------------- | ------- | ----------------------------- | -------------------------------- | ----------------------------------------------------------- |
| `LOG_LEVEL`                    | Nivel de log                          | O/O/O/O | `debug`/`info`/`warn`/`error` | Operación; Vercel                | Default seguro; redeploy                                    |
| `HEALTHCHECK_SECRET`           | Protege health detallado; **secreta** | O/O/C/C | >=32 caracteres               | Monitor/secret manager           | Health queda mínimo; redeploy; nunca cliente                |
| `APP_VERSION`                  | Versión                               | O/O/O/O | `2026.08.05`                  | CI/Vercel                        | `unknown`; redeploy; no cliente                             |
| `COMMIT_SHA`                   | Revisión                              | O/O/A/A | SHA Git                       | CI/Vercel                        | `unknown`; automático; no cliente                           |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`  | WhatsApp                              | O/O/O/O | dígitos E.164 `523300000000`  | Información aprobada             | Default institucional; redeploy; **sí** cliente             |
| `NEXT_PUBLIC_PHONE_DISPLAY`    | Teléfono visible                      | O/O/O/O | texto                         | Información aprobada             | Default; redeploy; **sí** cliente                           |
| `NEXT_PUBLIC_CONTACT_EMAIL`    | Correo visible                        | O/O/O/O | email                         | Información aprobada             | Default; redeploy; **sí** cliente                           |
| `NEXT_PUBLIC_OFFICE_ADDRESS`   | Domicilio visible                     | O/O/O/O | texto                         | Información aprobada             | Default; redeploy; **sí** cliente                           |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Activa analítica aprobada             | O/O/O/O | `false`                       | Privacidad/consentimiento        | Default false; redeploy; **sí** cliente                     |
| `NEXT_PUBLIC_ENABLE_PORTAL`    | Feature flag visible                  | O/O/O/O | `true`                        | Producto                         | El código puede usar default; redeploy; **sí** cliente      |
| `E2E_BASE_URL`                 | Reutiliza servidor E2E                | O/O/O/O | URL local                     | Shell/CI                         | Playwright levanta puerto 3100; no redeploy; no app cliente |
| `CI`                           | Ajusta Playwright                     | O/A/A/A | `true`                        | Runner                           | Ejecución local; automático                                 |
| `NEXT_RUNTIME`                 | Runtime de Next                       | A/A/A/A | `nodejs`                      | Next.js                          | Instrumentation decide no actuar; automático                |

## Matriz mínima de Vercel Preview

Además de variables automáticas de Vercel:

| Obligatorias                                                 | Valor/política                                                             |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| `DATABASE_URL`, `DIRECT_URL`                                 | Neon Preview aislado                                                       |
| `AUTH_SECRET`, `MFA_RECOVERY_CODE_PEPPER`, `RATE_LIMIT_SALT` | Secretos exclusivos de Preview                                             |
| `DATA_ENCRYPTION_KEY_CURRENT`, `DATA_ENCRYPTION_KEY_VERSION` | Clave/version exclusiva                                                    |
| `RATE_LIMIT_PROVIDER`                                        | `database` recomendado                                                     |
| `EMAIL_PROVIDER` + Brevo                                     | `brevo` sandbox/prueba o `mock` solo durante desarrollo controlado         |
| `EMAIL_CRON_SECRET`                                          | Secreto exclusivo                                                          |
| `CALENDAR_PROVIDER`, `NEXT_PUBLIC_CALENDAR_PROVIDER`         | `mock` permitido o Google de prueba                                        |
| `CALENDAR_SYNC_CRON_SECRET`                                  | Secreto exclusivo                                                          |
| `STORAGE_PROVIDER`/S3                                        | S3 de prueba para validar documentos; local solo borrador sin persistencia |
| `FILE_SCANNER_PROVIDER`/ClamAV                               | ClamAV de prueba para prueba completa                                      |
| `FILE_SCAN_CRON_SECRET`                                      | Secreto exclusivo                                                          |
| `ENABLE_DEMO_AUTH`                                           | Opcional `true`; nunca reutilizar usuarios reales                          |
| `ALLOW_DATABASE_SEED`                                        | `false`, salvo ejecución efímera deliberada y revertida                    |

## Matriz mínima de Vercel Production

| Obligatorias   | Valor/política                                                                        |
| -------------- | ------------------------------------------------------------------------------------- |
| URL y datos    | `NEXT_PUBLIC_SITE_URL=https://xs-abogados.com`, Neon Production pooled/direct         |
| Auth/cifrado   | `AUTH_SECRET`, pepper, salt y clave AES exclusivos de Production                      |
| Correo         | `EMAIL_PROVIDER=brevo`, remitente verificado, API key, destinatario y cron secret     |
| Calendario     | ambos providers=`google`, OAuth/ID y cron secret                                      |
| Objetos        | `STORAGE_PROVIDER=s3`, endpoint/región/bucket/IAM, SSE y KMS si aplica                |
| Scanner        | `FILE_SCANNER_PROVIDER=clamav`, host/puerto y cron secret                             |
| Controles      | `RATE_LIMIT_PROVIDER=database`, `ENABLE_DEMO_AUTH=false`, `ALLOW_DATABASE_SEED=false` |
| Observabilidad | `HEALTHCHECK_SECRET`, versión/commit y nivel aprobado                                 |

## Rotación segura

1. Crear secreto nuevo sin eliminar el anterior.
2. Para AES, subir `DATA_ENCRYPTION_KEY_CURRENT` y conservar la previa con su versión.
3. Redeploy y verificar descifrado, MFA, outbox y health.
4. Recifrar o agotar cargas antiguas; regenerar códigos si cambia el pepper.
5. Revocar la credencial anterior y documentar auditoría.
6. Ante exposición, cerrar sesiones, rotar proveedores y evaluar notificación de incidente.
