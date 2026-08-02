# Portal del cliente

## Alcance

El portal muestra únicamente información que la firma marcó como visible: resumen del asunto, etapa general, próxima actuación, próximas citas, documentos compartidos, mensajes, solicitudes e historial público.

No debe contener por defecto teoría del caso, estrategia, evaluaciones internas, notas de conflicto, datos de terceros ni borradores no aprobados.

## Roles

- `CLIENT`: asuntos asociados a su `ClientProfile`.
- `LAWYER`: asuntos con asignación vigente.
- `ADMIN`: operación general y configuración.

Una sesión válida no otorga acceso automático. Cada Server Action, Route Handler y consulta vuelve a comprobar rol, estado de cuenta y propiedad/asignación.

## Flujos

- Cliente: consulta resumen, abre asunto, revisa historial/documentos/mensajes, actualiza datos y cambia contraseña.
- Profesional: consulta únicamente asuntos asignados y participa en mensajes autorizados.
- Administrador: consulta clientes, asuntos, equipo, artículos y formularios; gestiona citas, responsables, notas internas, horario global, bloqueos y configuración institucional.

## Estados sugeridos

Evaluación inicial, En análisis, Estrategia definida, En negociación, En trámite, Pendiente de autoridad, Pendiente del cliente, Resolución, Concluido y Archivado.

## Datos DEMO

El seed local crea registros ficticios identificados con `DEMO` dentro de las mismas consultas autorizadas que se usan en producción. El seed aborta en producción y las credenciales locales deben eliminarse antes del lanzamiento.

## Operación

- Dar de alta cuentas mediante un flujo interno verificado.
- Suspender acceso inmediatamente al terminar la relación o detectar riesgo.
- Revisar asignaciones y documentos visibles antes de cada publicación.
- Conservar auditoría de cambios sin permitir edición retroactiva.
- Probar que un cliente no pueda inferir ni abrir IDs de otro cliente.
