# Clasificación, retención y eliminación de datos

Propuesta técnica con corte al 5 de agosto de 2026. Los plazos marcados **requieren aprobación jurídica y de dirección** antes de configurarse o ejecutarse. Ninguna cifra de este documento sustituye obligaciones legales, fiscales, profesionales, contractuales, de conservación probatoria o instrucciones del cliente.

## Principios

- Minimización, propósito definido, necesidad de conocer y denegación por defecto.
- Separación entre datos públicos, internos, confidenciales y altamente confidenciales.
- Conservación legal/instrucción de preservación prevalece sobre la purga programada.
- Borrado verificable en base, objetos, cachés, proveedores y backups conforme a sus ventanas.
- Auditoría de creación, acceso privilegiado, exportación, cambio de visibilidad y eliminación.
- No copiar expedientes reales a Development, CI o Preview.

## Clases

| Clase                  | Ejemplos                                                                                                                          | Acceso                                          | Protección mínima                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Público                | Páginas institucionales, perfiles aprobados, áreas, Insights publicados, domicilio/teléfono públicos                              | Internet                                        | Integridad, control editorial, HTTPS, backup                                                        |
| Interno                | Configuración operativa no secreta, borradores no jurídicos, métricas agregadas, procedimientos                                   | Personal autorizado                             | Auth, rol, logs mínimos, noindex                                                                    |
| Confidencial           | Perfil/contacto de cliente, citas, mensajes, avances, borradores, asignaciones, auditoría ordinaria                               | Cliente dueño/equipo asignado según visibilidad | Auth+MFA según rol, autorización por recurso, cifrado en tránsito/reposo, retención                 |
| Altamente confidencial | Documentos de expediente, estrategia/notas reservadas, secretos MFA, tokens, claves, connection strings, payloads transaccionales | Mínimo grupo necesario; secretos solo runtime   | Cifrado de aplicación cuando corresponda, S3 privado/cuarentena, MFA, rotación, auditoría reforzada |

## Inventario y tratamiento propuesto

| Conjunto                       | Clase                              | Sistema                | Retención propuesta                                            | Eliminación                                                             | Aprobación             |
| ------------------------------ | ---------------------------------- | ---------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------- |
| Contenido público publicado    | Público                            | PostgreSQL/Vercel      | Vigencia + archivo histórico                                   | Despublicar y purgar caché; conservar versión aprobada si procede       | Editorial/jurídica     |
| Cuentas y perfiles             | Confidencial                       | PostgreSQL             | Relación activa + **plazo legal por definir**                  | Suspender, archivar, anonimizar cuando sea lícito                       | **Sí**                 |
| Sesiones                       | Confidencial                       | PostgreSQL             | Expiración + 30 días propuestos para seguridad                 | Purga batch por `expiresAt`/`revokedAt`                                 | Seguridad/privacidad   |
| Invitación/recuperación        | Altamente confidencial             | PostgreSQL             | Hasta uso/expiración + 30 días de metadata                     | Borrar hashes/cargas; conservar evento mínimo                           | Seguridad              |
| MFA/códigos                    | Altamente confidencial             | PostgreSQL             | Mientras cuenta/MFA esté activo                                | Borrar secreto cifrado y hashes al desactivar/archivar                  | Seguridad              |
| Clientes/asuntos               | Confidencial/alta                  | PostgreSQL             | Cierre + **plazo profesional/contractual por definir**         | Hold legal, luego anonimización/purga controlada                        | **Sí**                 |
| Avances/mensajes/notas         | Confidencial/alta                  | PostgreSQL             | Igual al asunto                                                | Tombstone/superseding; purga solo con autorización                      | **Sí**                 |
| Documentos                     | Altamente confidencial             | S3 + metadata DB       | Igual al asunto o instrucción del cliente                      | `deletedAt`, revocar acceso, borrar objeto/versiones y registrar prueba | **Sí**                 |
| Cuarentena infectada/rechazada | Altamente confidencial             | S3 quarantine          | 7–30 días propuestos o inmediato si política lo exige          | Borrado irreversible + evento mínimo                                    | Seguridad/**jurídica** |
| Citas y holds                  | Confidencial                       | PostgreSQL/Google      | Holds hasta expiración; citas 2 años propuestos                | Purga/anominización coordinada con Google                               | **Sí**                 |
| Notificaciones                 | Confidencial                       | PostgreSQL             | 180 días propuestos                                            | Purga batch por destinatario/fecha                                      | Privacidad             |
| EmailOutbox                    | Altamente confidencial en tránsito | PostgreSQL/Brevo       | Payload se limpia al estado terminal; metadata 1 año propuesta | Scrub inmediato de payload + purga metadata                             | **Sí** para plazo      |
| Auditoría                      | Confidencial/alta                  | PostgreSQL/log store   | 2–5 años propuestos, según obligación                          | Archivo protegido y purga aprobada; nunca editar                        | **Sí**                 |
| Rate limits/IP hash            | Interno/confidencial               | PostgreSQL             | Ventana + margen técnico (máx. 30 días propuesto)              | Purga por expiración                                                    | Privacidad             |
| Logs operativos                | Confidencial minimizado            | Vercel/agregador       | 30–90 días propuestos                                          | Lifecycle del proveedor                                                 | **Sí**                 |
| Backups                        | Hereda máxima clase                | Neon/S3                | Según RPO y obligación; propuesta 35 días + hitos              | Expiración administrada, destrucción verificable                        | **Sí**                 |
| Datos demo/CI                  | Ficticio                           | CI/PostgreSQL temporal | Duración del job o Preview                                     | Destruir DB/bucket de prueba                                            | Ingeniería             |

## Reglas por ciclo de vida

### Alta y uso

- Registrar base/propósito institucional y visibilidad antes de recolectar.
- Evitar campos libres cuando basta un estado; no enviar contenido jurídico por correo.
- Etiquetar objeto/documento con dueño y asunto; no usar nombres personales en keys.
- El acceso de ADMIN a documentos debe responder a atribución concreta y auditarse.

### Cierre y archivo

- Al cerrar un asunto, bloquear escrituras ordinarias y determinar hold legal.
- Reasignar responsable de custodia, verificar documentos y exportaciones autorizadas.
- Archivar cuentas solo después de revisar asuntos, citas y artículos pendientes.
- Revocar sesiones, invitaciones, URLs/tokens y credenciales asociadas.

### Eliminación

1. Validar identidad, autoridad, asunto y ausencia de hold legal.
2. Crear orden con alcance, sistemas, responsable y fecha.
3. Marcar lógico y retirar acceso/caché inmediatamente.
4. Borrar objeto, versiones, miniaturas, registros derivados y proveedor externo.
5. Mantener únicamente evidencia mínima de la eliminación si es jurídicamente lícito.
6. Confirmar cuándo expira la última copia de backup.
7. Realizar doble revisión para lotes o datos altamente confidenciales.

No usar borrado masivo ad hoc ni `prisma migrate reset`. Los cambios de retención deben ensayarse con datos ficticios y modo dry-run.

## Derechos y solicitudes

Crear un procedimiento aprobado para acceso, rectificación, oposición/cancelación cuando aplique, portabilidad y limitación. Verificar identidad por un canal independiente, buscar en todos los sistemas y excluir datos de terceros/privilegios conforme a análisis jurídico. Registrar solicitud, decisión, alcance, exportación, eliminación y respuesta sin copiar documentos a canales inseguros.

## Backups y restauración

Los backups heredan la clasificación más alta. Deben estar cifrados, con acceso MFA, registro de restauraciones y proyecto aislado. Una eliminación puede permanecer en backup hasta que venza el ciclo aprobado; debe impedirse su reintroducción accidental tras restaurar mediante una lista de supresiones o reproceso documentado.

## Responsables sugeridos

| Decisión               | Responsable                  | Consultados                           |
| ---------------------- | ---------------------------- | ------------------------------------- |
| Plazos legales y holds | Socio responsable/privacidad | Dirección, cliente cuando corresponda |
| Controles técnicos     | Seguridad/ingeniería         | Privacidad y operación                |
| Acceso a expediente    | Socio supervisor             | Abogado responsable                   |
| Borrado de objetos     | Operación autorizada         | Seguridad + socio responsable         |
| Backups/RTO/RPO        | Dirección + operación        | Ingeniería y privacidad               |
| Incidente/notificación | Coordinador de incidente     | Jurídico, dirección, proveedores      |

## Decisiones pendientes de aprobación jurídica

- [ ] Plazo por tipo de asunto, contrato, documento y cierre de relación.
- [ ] Tratamiento de comunicaciones privilegiadas y evidencia.
- [ ] Holds legales, litigios y solicitudes de autoridad.
- [ ] Plazos de auditoría, logs, correo y citas.
- [ ] Atención de derechos y verificación de identidad.
- [ ] Encargados/subencargados, transferencias y regiones de datos.
- [ ] Texto y mecanismo de consentimiento/aviso cuando proceda.
- [ ] Procedimiento de destrucción y constancia.
- [ ] RTO/RPO y periodo de backups.

Hasta aprobarlos, no automatizar purgas de expedientes ni documentos reales; aplicar minimización, controles de acceso y holds conservadores.
