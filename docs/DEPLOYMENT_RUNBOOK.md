# Runbook de despliegue controlado

Procedimiento literal para XS ABOGADOS. No contiene credenciales. Preview y Production deben usar proyectos, bases, buckets, calendarios, API keys y secretos distintos. Cada paso requiere responsable, hora, evidencia y resultado.

## 1. Preparación

1. Abrir ticket de cambio con alcance, responsables, ventana, rollback y guardia posterior.
2. Congelar cambios no relacionados y verificar rama/commit aprobados.
3. Confirmar Node 22.x y ejecutar `npm ci`, `npm audit`, `npm run verify`, integración y E2E.
4. Revisar `git status`, lockfile, migraciones y `git diff --check`; confirmar que no hay `.env`, dumps, documentos ni secretos versionados.
5. Cotejar variables con [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md).

## 2. Backup

1. Confirmar PITR/retención de Neon y backup lógico reciente.
2. Exportar evidencia de hora/estado, no la credencial ni datos al ticket público.
3. Verificar versionado/lifecycle del bucket.
4. Ensayar restauración en un proyecto aislado al menos antes del primer Production y después de cambios mayores.
5. Definir punto exacto de rollback y responsable que puede autorizarlo.

## 3. Neon Preview

1. Crear proyecto/branch/database exclusivo de Preview, sin datos reales.
2. Crear rol runtime mínimo y credencial de migración directa separada cuando el plan lo permita.
3. Copiar URL pooled a `DATABASE_URL` y directa a `DIRECT_URL` sin imprimirlas.
4. Exigir TLS y revisar región, límites y expiración del branch.

## 4. Variables Preview

1. Cargar secretos exclusivos en Vercel Preview.
2. Configurar `VERCEL_ENV` solo mediante Vercel; no sobrescribirlo.
3. Establecer DB, auth, AES, MFA pepper, rate salt, cron secrets y providers.
4. `ENABLE_DEMO_AUTH` puede ser `true` únicamente si el escenario lo requiere; `ALLOW_DATABASE_SEED=false` normalmente.
5. Validar que ninguna variable secreta empiece con `NEXT_PUBLIC_`.

## 5. Migraciones Preview

1. Guardar el commit y el host objetivo sin credenciales.
2. Ejecutar desde terminal segura: `npm run db:generate` y `npm run db:deploy` con URLs Preview.
3. No ejecutar `migrate reset`, `db push` ni seed automático.
4. Revisar `_prisma_migrations`, índices, defaults/backfill y logs de duración/locks.
5. Detener si el host no corresponde inequívocamente a Preview.

## 6. Deploy Preview

1. Importar/vincular el repositorio en Vercel con Node 22.x.
2. Install Command: `npm ci`; Build Command: `npm run build`; sin Output Directory.
3. Desplegar el commit ya migrado.
4. Confirmar build, instrumentación, CSP, `noindex` y ausencia de errores de runtime.

## 7. Smoke tests Preview

Validar inicio, Firma, Equipo, Áreas, Insights, agenda, contacto, términos/privacidad, Maps y WhatsApp; después login, MFA, cierre/revocación de sesión, portales, asunto propio, mensaje, documento de prueba inocuo, cita, artículo, administración, auditoría, health y errores 404/403. No usar información de clientes.

## 8. E2E Preview

1. Crear fixtures ficticios para ADMIN, PARTNER, ASSOCIATE, Cliente A y Cliente B.
2. Ejecutar `E2E_BASE_URL=https://<preview> npm run test:e2e`.
3. Añadir casos autenticados de matriz/IDOR, concurrencia de cita y ciclo editorial.
4. Guardar reporte/traces sin secretos; eliminar fixtures al finalizar.

## 9. Brevo sandbox

1. Crear API key/remitente de Preview y habilitar sandbox.
2. Ejecutar cita, contacto, recuperación, invitación, cancelación/reprogramación, mensajes y decisiones editoriales con destinatarios de prueba autorizados.
3. Verificar `providerId`, outbox `SENT`, retry/dead letter y redacción de errores.
4. No crear listas, campañas ni automatizaciones comerciales.

## 10. S3 Preview

1. Crear bucket privado separado, bloquear acceso público y habilitar SSE/versionado/lifecycle.
2. Crear IAM mínimo para prefijos de cuarentena/final; cargar credenciales en Preview.
3. Probar objeto permitido, MIME falso, tamaño excesivo, key traversal, usuario ajeno y URL expirada.
4. Confirmar que nada se almacena en `public` ni se devuelve una URL permanente.

## 11. Google Calendar de prueba

1. Crear proyecto OAuth/cuenta/calendario exclusivos de prueba.
2. Configurar scopes mínimos, refresh token y calendar ID.
3. Cambiar providers a `google` en Preview y redeploy.
4. Probar disponibilidad, alta idempotente, reprogramación, cancelación, fallo transitorio, reintento y cron sin duplicados.
5. Borrar eventos ficticios al terminar.

## 12. Aprobación

Reunir resultados, capturas/redacciones, migración, auditoría, proveedores, accesibilidad, privacidad y rollback. Dirección, socio responsable, seguridad/ingeniería y operación aprueban por escrito. Cualquier P1/P2 o control externo crítico pendiente bloquea Production.

## 13. Neon Production

1. Crear/seleccionar proyecto Production separado y región aprobada.
2. Habilitar PITR/backup/alertas y roles mínimos.
3. Ensayar restore si no existe evidencia vigente.
4. Obtener URL pooled/direct sin registrarlas en texto plano.

## 14. Variables Production

1. Crear secretos distintos de Preview.
2. Configurar Providers reales, rate database, S3/ClamAV, crons y health.
3. Establecer `ENABLE_DEMO_AUTH=false`, `ALLOW_DATABASE_SEED=false`, `BREVO_SANDBOX_MODE=false`.
4. Validar `NEXT_PUBLIC_SITE_URL=https://xs-abogados.com` y solo datos públicos en `NEXT_PUBLIC_*`.
5. Usar revisión a cuatro ojos contra la tabla de variables.

## 15. Migraciones Production

1. Activar ventana y verificar backup/punto de rollback.
2. Confirmar dos veces host/database Production sin mostrar contraseña.
3. Ejecutar `npm run db:generate` y `npm run db:deploy` desde runner seguro de un solo operador autorizado.
4. Observar locks, CPU/conexiones y duración; no ejecutar seed.
5. Verificar `_prisma_migrations`, columnas, índices y consultas mínimas.

## 16. Deploy Production

1. Desplegar exactamente el commit aprobado.
2. Verificar build e instrumentación; no promover otro artefacto.
3. Mantener guardia y métricas mientras se ejecutan smoke tests.
4. Si existe incompatibilidad, aplicar el rollback del paso 27.

## 17. Creación del primer ADMIN

1. Ejecutar `ADMIN_INITIAL_PASSWORD='<temporal fuerte>' npm run admin:create` desde terminal segura con DB Production explícita.
2. No guardar la contraseña en `.env`, historial, ticket ni Vercel.
3. Entregarla por canal autorizado y forzar cambio inmediato.
4. Retirar variable y registrar solo identidad/fecha/actor.

## 18. MFA

1. Iniciar sesión con el ADMIN, cambiar contraseña y enrolar TOTP.
2. Guardar códigos de recuperación fuera del repositorio en custodia aprobada.
3. Probar OTP y un código de recuperación, luego regenerarlos.
4. Repetir para todos los socios antes de habilitar sus tareas.

## 19. DNS

1. Añadir dominio en Vercel y usar únicamente registros mostrados por el proveedor.
2. Reducir TTL con anticipación si aplica; configurar apex y `www` canonical.
3. Mantener/definir redirects autorizados desde Arias & Silva.
4. Verificar HTTPS, HSTS, canonical, sitemap y robots tras propagación.

## 20. Brevo Production

1. Crear API key exclusiva con alcance transaccional y remitente/dominio verificado.
2. Configurar remitente, reply-to, destinatario y sandbox false.
3. Enviar únicamente transacciones de smoke a cuentas autorizadas.
4. Revisar entrega, rebote, outbox y ausencia de contenido sensible en logs.

## 21. SPF, DKIM y DMARC

1. Publicar exactamente los registros entregados por Brevo sin reemplazar otros emisores válidos.
2. Validar SPF único, DKIM y alineación DMARC.
3. Empezar DMARC con política/monitoreo aprobados y endurecer tras observar reportes.
4. No declarar correo listo hasta confirmar autenticación en mensajes recibidos.

## 22. S3 Production

Configurar bucket privado, bloqueo público, IAM mínimo, HTTPS, SSE/KMS según política, versionado, lifecycle, logs y alertas. Probar con archivo ficticio y eliminarlo conforme al flujo. Confirmar cuarentena y que la URL firmada expire.

## 23. Google Calendar Production

Usar cuenta/calendario institucional con scopes mínimos. Probar cita ficticia autorizada de extremo a extremo, actualización/cancelación, cron e idempotencia. Eliminar el evento y revisar auditoría.

## 24. Cron

Configurar llamadas periódicas autenticadas a:

- `/api/cron/email-outbox` con `EMAIL_CRON_SECRET`.
- `/api/cron/calendar-sync` con `CALENDAR_SYNC_CRON_SECRET`.
- `/api/cron/document-scan` con `FILE_SCAN_CRON_SECRET`.

Evitar secretos en query strings/logs; usar Authorization. Comprobar exclusión mutua, timeout, backoff, dead letter y alerta por acumulación.

## 25. Observabilidad

Configurar monitor autenticado de `/api/health`, alertas de 5xx/latencia, outbox muerto, sync fallida, documentos pendientes, auth anómala, DB/conexiones, cuota Brevo/Google y S3. Confirmar redacción y retención aprobada. Definir guardia/escalamiento.

## 26. Smoke tests Production

Usar datos ficticios mínimos. Verificar público, headers, login/MFA/sesión, cada rol, IDOR A/B, agenda y doble reserva, correo, calendar sync, documento limpio/rechazado, artículo, auditoría, crons y health. Requiere revisión humana móvil/escritorio/teclado. Registrar y retirar fixtures.

## 27. Rollback

1. Declarar incidente y congelar escrituras/procesadores afectados cuando sea seguro.
2. Para aplicación: redeploy del artefacto previo compatible; no revertir esquema aditivo a ciegas.
3. Para datos: restaurar backup/PITR a proyecto nuevo, validar integridad y conmutar solo con aprobación.
4. Nunca usar `migrate reset`, `db push --force-reset` ni DROP improvisado.
5. Rotar credenciales si pudieron exponerse y preservar evidencia.

## 28. Seguimiento

Mantener guardia reforzada 24–72 h según riesgo. Revisar diariamente fallos, crons, latencia, auth, documentos, correo y calendario. Cerrar el cambio solo con evidencia, incidencias resueltas, fixtures borrados y tareas residuales asignadas. Realizar retrospectiva y actualizar este runbook.
