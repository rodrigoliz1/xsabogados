# Checklist verificable de Production

No marcar una casilla sin evidencia. Estados sugeridos: pendiente, aprobado, bloqueado o no aplica con justificación. Roles: DIR = Dirección/socio responsable; LEG = privacidad/jurídico; ENG = ingeniería; SEC = seguridad; OPS = operación; QA = pruebas.

## Gobierno y repositorio

| Hecho                                                                             | Responsable | Evidencia esperada                                   |
| --------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------- |
| [ ] Cambio, ventana, guardia y rollback aprobados                                 | DIR/OPS     | Ticket con commit, horario y responsables            |
| [ ] Repositorio privado, branch protection y revisión obligatoria                 | ENG/SEC     | Captura/configuración GitHub                         |
| [ ] CI/CodeQL/Dependabot sin bloqueos altos o críticos                            | ENG         | URLs de checks del commit                            |
| [ ] Sin `.env`, dumps, `.data`, documentos, tokens ni `*.tsbuildinfo` versionados | SEC         | `security:secrets`, `git ls-files` y revisión manual |
| [ ] Textos, biografías, datos institucionales y legal aprobados                   | DIR/LEG     | Versión/fecha de aprobación                          |
| [ ] Retención, incidentes, altas/bajas y encargados aprobados                     | LEG/DIR     | Política firmada                                     |

## Calidad del artefacto

| Hecho                                                             | Responsable | Evidencia esperada                 |
| ----------------------------------------------------------------- | ----------- | ---------------------------------- |
| [ ] Node 22.x y `npm ci` aprobados                                | ENG         | Log CI                             |
| [ ] `npm audit` sin vulnerabilidades no aceptadas                 | SEC         | Reporte/decisión de riesgo         |
| [ ] Prisma generate/validate, formato, lint y typecheck aprobados | ENG         | Log CI                             |
| [ ] Unitarias e integración aprobadas                             | QA/ENG      | Conteo y reporte                   |
| [ ] Build del commit aprobado                                     | ENG         | Deployment/build ID                |
| [ ] E2E público y autenticado por rol aprobado en Preview         | QA          | Reporte Playwright/traces saneados |
| [ ] Accesibilidad teclado, lector, móvil, zoom y reduced motion   | QA          | Matriz de dispositivos/hallazgos   |

## Neon y datos

| Hecho                                                          | Responsable | Evidencia esperada            |
| -------------------------------------------------------------- | ----------- | ----------------------------- |
| [ ] Preview y Production separados                             | OPS         | IDs/regiones sin credenciales |
| [ ] `DATABASE_URL` pooled y `DIRECT_URL` directas verificadas  | ENG/OPS     | Checklist a cuatro ojos       |
| [ ] PITR/backups habilitados y restore aislado ensayado        | OPS/SEC     | Hora, RPO/RTO y resultado     |
| [ ] Migraciones revisadas por orden, locks, backfill e índices | ENG         | Revisión SQL firmada          |
| [ ] `npm run db:deploy` aplicado en Preview sin seed           | ENG         | `_prisma_migrations`/log      |
| [ ] `npm run db:deploy` aplicado en Production sin seed        | ENG/OPS     | Log controlado y métricas     |
| [ ] `ENABLE_DEMO_AUTH=false`, `ALLOW_DATABASE_SEED=false` en P | SEC         | Variables cotejadas           |

## Identidad y autorización

| Hecho                                                                  | Responsable | Evidencia esperada                        |
| ---------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| [ ] Secretos auth, AES, pepper y rate salt exclusivos de P             | SEC         | Registro de creación/rotación sin valores |
| [ ] Primer ADMIN creado por CLI, password cambiado y variable retirada | SEC/DIR     | Evento de auditoría                       |
| [ ] MFA enrolado/probado para ADMIN y todos los PARTNER                | SEC         | Matriz de cuentas, no códigos             |
| [ ] Revocación individual/global, idle y expiración probados           | QA          | Casos con resultado                       |
| [ ] Suspensión/archivo invalida accesos                                | QA/ENG      | Casos E2E                                 |
| [ ] IDOR Cliente A/B y asociado asignado/no asignado                   | SEC/QA      | Reporte de rutas y respuestas             |
| [ ] `INTERNAL_ONLY` invisible a asociados/clientes                     | QA          | Casos E2E                                 |

## Brevo y correo

| Hecho                                                          | Responsable | Evidencia esperada         |
| -------------------------------------------------------------- | ----------- | -------------------------- |
| [ ] API key transaccional exclusiva y remitente verificado     | OPS/SEC     | ID de credencial/remitente |
| [ ] SPF, DKIM y DMARC alineados                                | OPS         | Validación DNS/headers     |
| [ ] Sandbox desactivado en P                                   | OPS         | Configuración cotejada     |
| [ ] Contacto y cita: confirmación + aviso despacho             | QA          | Message IDs saneados       |
| [ ] Recuperación, invitación, cancelación y reprogramación     | QA          | Casos y entregas           |
| [ ] Mensajes/avances/editorial sin contenido sensible excesivo | LEG/QA      | Muestras redactadas        |
| [ ] Outbox retry, lease, dead letter y requeue auditado        | ENG/OPS     | Registros de prueba        |

## Calendario y citas

| Hecho                                                      | Responsable | Evidencia esperada             |
| ---------------------------------------------------------- | ----------- | ------------------------------ |
| [ ] Provider Google real y calendario institucional mínimo | OPS         | Proyecto/calendario sin token  |
| [ ] OAuth/scopes/refresh token revisados y rotables        | SEC         | Inventario de acceso           |
| [ ] Disponibilidad y zona horaria confirmadas              | DIR/QA      | Casos esperados                |
| [ ] Propuesta solo aceptable por contraparte               | QA          | E2E bilateral                  |
| [ ] Holds/buffer/doble reserva bajo concurrencia           | QA/ENG      | Prueba paralela contra Preview |
| [ ] Alta/update/cancel idempotentes y cron reintentable    | ENG/OPS     | IDs/eventos ficticios          |
| [ ] ICS válido en clientes principales                     | QA          | Outlook/Apple/Google test      |

## Documentos, S3 y antivirus

| Hecho                                                                | Responsable | Evidencia esperada                  |
| -------------------------------------------------------------------- | ----------- | ----------------------------------- |
| [ ] Bucket P privado, bloqueo público, SSE/KMS, versionado/lifecycle | SEC/OPS     | Policy/config revisada              |
| [ ] IAM mínimo por bucket/prefijos y credencial rotada               | SEC         | Policy diff sin secreto             |
| [ ] ClamAV real accesible solo desde runtime autorizado              | SEC/OPS     | Prueba health/EICAR según protocolo |
| [ ] Cuarentena, CLEAN, REJECTED y fallo scanner                      | QA          | Casos y auditoría                   |
| [ ] MIME falso, OOXML, tamaño y path traversal rechazados            | SEC/QA      | Suite de seguridad                  |
| [ ] Descarga exige acceso, estado CLEAN y TTL breve                  | SEC/QA      | Pruebas IDOR/expiración             |
| [ ] Documentos privados ausentes de `public` y logs                  | SEC         | Revisión repo/runtime               |

## Vercel, red y observabilidad

| Hecho                                                           | Responsable | Evidencia esperada          |
| --------------------------------------------------------------- | ----------- | --------------------------- |
| [ ] Variables P cotejadas; ningún secreto `NEXT_PUBLIC_*`       | SEC/OPS     | Checklist doble control     |
| [ ] `RATE_LIMIT_PROVIDER=database`                              | SEC         | Config + prueba distribuida |
| [ ] Crons de email/calendar/scanner autenticados y alertados    | OPS         | Ejecuciones y respuestas    |
| [ ] `/api/health`, 5xx, latencia y colas monitorizados          | OPS         | Dashboard/alerta de prueba  |
| [ ] Logs JSON redactados y retención aprobada                   | SEC/LEG     | Muestras y policy           |
| [ ] CSP nonce, HSTS, headers, cookies y CORS/origin verificados | SEC         | Scan/curl/DAST              |
| [ ] Dominio/apex/www/HTTPS/canonical/sitemap/robots             | OPS/QA      | URLs y certificados         |
| [ ] Redirects Arias & Silva autorizados                         | DIR/OPS     | Tabla de mapeos aprobada    |

## Producto y operación

| Hecho                                                                      | Responsable | Evidencia esperada   |
| -------------------------------------------------------------------------- | ----------- | -------------------- |
| [ ] Público, Maps, WhatsApp, formularios y 404                             | QA          | Smoke matrix         |
| [ ] Cliente: asuntos, avances, mensajes, documentos, citas, notificaciones | QA          | E2E por fixture      |
| [ ] Asociado: solo asignados, disponibilidad y borradores                  | QA          | E2E por fixture      |
| [ ] Socio: supervisión, reservados y aprobación editorial                  | QA          | E2E por fixture      |
| [ ] ADMIN: usuarios, auditoría, correo fallido y operación                 | QA/OPS      | E2E por fixture      |
| [ ] Riesgos residuales aceptados explícitamente                            | DIR/LEG/SEC | Acta de aceptación   |
| [ ] Smoke Production aprobado y fixtures eliminados                        | QA/OPS      | Reporte final        |
| [ ] Guardia 24–72 h y escalamiento activos                                 | OPS         | Calendario/contactos |

## Cierre

- [ ] Sin P1/P2 abiertos ni validación crítica “pendiente”.
- [ ] Rollback sigue siendo viable después de migrar.
- [ ] Evidencia guardada en ubicación autorizada, sin secretos ni expedientes.
- [ ] Post-lanzamiento y mantenimiento asignados.
