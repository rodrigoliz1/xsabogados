# Reporte de validación local

Fecha: 6 de agosto de 2026. Entorno: macOS arm64, Node `v24.14.1`, npm `11.11.0`. El objetivo del proyecto sigue siendo Node 22.x; npm emitió `EBADENGINE`, pero los comandos locales completaron. CI está configurado para Node 22.

## Resultados ejecutados

| Comando/verificación                                  | Resultado | Duración observada                     | Evidencia                                                    |
| ----------------------------------------------------- | --------- | -------------------------------------- | ------------------------------------------------------------ |
| `npm ci`                                              | Aprobado  | 20 s                                   | 558 paquetes instalados; 559 auditados; 0 vulnerabilidades   |
| `npm audit --audit-level=high`                        | Aprobado  | 2.7 s                                  | 0 vulnerabilidades                                           |
| `npm run db:generate`                                 | Aprobado  | incluido en `npm run db` (1.7 s total) | Prisma Client 6.19.3 generado                                |
| `npm run db:validate`                                 | Aprobado  | Ejecutado en lote                      | `schema.prisma` válido                                       |
| `npm run format` (dos pasadas)                        | Aprobado  | 2.5 s / 2.1 s                          | Segunda pasada idempotente                                   |
| `npm run format:check`                                | Aprobado  | Ejecutado en lote (9.1 s total)        | Todos los archivos cumplen Prettier                          |
| `npm run lint`                                        | Aprobado  | Ejecutado en lote                      | ESLint con cero warnings permitidos                          |
| `npm run typecheck`                                   | Aprobado  | Ejecutado en lote                      | TypeScript `--noEmit`                                        |
| `npm test`                                            | Aprobado  | 2.25 s (pasada agregada final)         | 27 suites, 99 pruebas                                        |
| PostgreSQL local + `npm run db:deploy`                | Aprobado  | 2.2 s junto con integración            | 4 migraciones aplicadas en orden a DB desechable             |
| `npm run test:integration`                            | Aprobado  | 144 ms (repetición final)              | 1 suite, 2 invariantes DB, sin warnings de config            |
| `npm run build`                                       | Aprobado  | compilación 3.7 s + tipos 4.3 s        | Next.js 16; 33 páginas generadas; rutas dinámicas compiladas |
| `E2E_BASE_URL=http://127.0.0.1:3000 npm run test:e2e` | Aprobado  | 7.5 s                                  | 8 casos Chromium desktop/móvil                               |
| `npm run security:secrets`                            | Aprobado  | Ejecutado en lote                      | 377 archivos versionados o candidatos, sin hallazgos         |
| `npm run verify`                                      | Aprobado  | 20.7 s                                 | Prisma, formato, lint, tipos, 99 pruebas y build en cadena   |
| `git diff --check`                                    | Aprobado  | <1 s                                   | Sin whitespace errors                                        |

Los tiempos corresponden a la salida o pared observada y no constituyen benchmark. Los comandos ejecutados en paralelo no tienen una duración individual confiable.

## Suites y alcance

### Unitarias: 27 archivos / 99 pruebas

Cubren políticas de autorización, propuestas bilaterales, autenticación cron, configuración documental, inspección magic bytes/OOXML, scanner, almacenamiento local/S3, outbox y backoff, cifrado AES-GCM, TOTP/recovery codes, ICS, invitaciones, logger/redacción, Same-Origin, configuración runtime, redirect seguro, validación y entorno.

### Integración: 1 archivo / 2 pruebas

Ejecutadas contra PostgreSQL local desechable después de `prisma migrate deploy`. Validan unicidad de recovery codes y revocación de sesiones. La suite se niega a correr si `TEST_DATABASE_URL` no identifica una base local/de prueba.

### E2E: 8 ejecuciones

Cuatro escenarios en Chromium desktop y Pixel 7:

- Sitio público, título, H1, dirección a Google Maps y WhatsApp.
- Redirección de `/admin` a acceso.
- Aviso de privacidad y términos sin leyendas provisionales.
- Axe sin violaciones críticas/serias en home y login (contraste se excluye del escaneo automático y requiere validación humana).

## Fallos encontrados y corregidos durante la validación

| Hallazgo                                                           | Corrección                                                       | Revalidación                   |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------ |
| Mock de scanner omitía el listado MIME exportado                   | Se completó el mock de test                                      | 99/99 unitarias                |
| Config Vitest integración `.ts` provocaba warning ESM/CJS          | Se renombró a `.mts` y se actualizó el script                    | Integración repetida en cierre |
| E2E no podía abrir segundo `next dev` por servidor existente       | `E2E_BASE_URL` permite reutilizar servidor externo sin detenerlo | 8/8 E2E                        |
| Enlace vacío de atribución visual no tenía nombre accesible        | `aria-label` y `title` descriptivos                              | Axe desktop/móvil aprobado     |
| Comparación de visibilidad imposible tras separar notas reservadas | Se simplificó la condición al valor realmente escribible         | Typecheck final aprobado       |

## Migraciones

Se creó un clúster PostgreSQL temporal en `/tmp`, sin red externa, y se aplicaron en orden:

1. `20260802000000_initial`
2. `20260802010000_neon_brevo_outbox`
3. `20260803000000_full_legal_platform`
4. `20260805000000_production_security_hardening`

No se ejecutó seed, `migrate reset`, `db push`, migración remota ni comando destructivo. El clúster se detuvo y eliminó después de las pruebas.

## Cobertura

No hay proveedor/script de cobertura porcentual configurado; por ello no se reporta un porcentaje. Añadir cobertura con umbrales debe hacerse en una tarea separada sin confundir cantidad de pruebas con cobertura efectiva.

## Servicios mock durante pruebas

- Correo: `EMAIL_PROVIDER=mock`; no se llamó Brevo.
- Calendario: `CALENDAR_PROVIDER=mock`; no se llamó Google.
- Scanner: mock/unitario; no se llamó ClamAV real.
- Objetos: unitarias de firma/almacenamiento; no se cargó a S3 real.
- DB: PostgreSQL local; no se llamó Neon.

## No ejecutado / pendiente externo

| Validación                                                  | Estado                     | Motivo/próximo paso                                        |
| ----------------------------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| Neon Preview/Production y pool real                         | No ejecutado               | Requiere proyectos/credenciales; seguir runbook            |
| Brevo sandbox/Production, entrega/rebote                    | No ejecutado               | Prohibido enviar correo real en esta tarea                 |
| Google Calendar real                                        | No ejecutado               | Prohibido crear eventos reales en esta tarea               |
| S3/IAM/KMS/bucket real                                      | No ejecutado               | Prohibido subir documentos reales; usar fixture en Preview |
| ClamAV de red                                               | No ejecutado               | Requiere infraestructura aislada                           |
| E2E autenticado completo ADMIN/PARTNER/ASSOCIATE/CLIENT A/B | Pendiente Preview          | Requiere fixtures y DB desplegada                          |
| Prueba de carga/doble reserva contra Neon                   | Pendiente Preview          | Requiere concurrencia distribuida real                     |
| Backup/PITR y restauración                                  | Pendiente                  | Requiere Neon/S3 reales                                    |
| DNS, HTTPS, CSP y correo autenticado reales                 | Pendiente Production       | Requiere dominio/proveedores                               |
| Accesibilidad manual y dispositivos reales                  | Requiere validación humana | Teclado, lector, contraste, zoom, iOS/Android              |
| Pentest/DAST                                                | Pendiente                  | Ejecutar contra Preview autorizado                         |

## Limitaciones

El build local usa secretos/configuración local ignorada sin exponer sus valores. Pasar pruebas locales no demuestra IAM, cuotas, red, TLS, backups ni comportamiento de proveedor. La plataforma solo puede aprobarse para Production después de completar [DEPLOYMENT_RUNBOOK.md](./DEPLOYMENT_RUNBOOK.md) y [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md).
