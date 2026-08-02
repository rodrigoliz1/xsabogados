# Arquitectura

## Principios

- Server Components por defecto; JavaScript cliente solo para interacción real.
- PostgreSQL como fuente canónica de datos; Prisma concentra acceso y relaciones.
- Autenticación no equivale a autorización: cada consulta privada aplica políticas en servidor.
- Integraciones detrás de interfaces sustituibles; ningún secreto llega al navegador.
- Campos internos y visibles para cliente se modelan y seleccionan por separado.

## Capas

```text
Navegador
  → App Router (páginas y Route Handlers)
    → validación Zod + rate limit + políticas
      → servicios de dominio
        → repositorios Prisma
        → CalendarProvider / EmailProvider / StorageProvider
          → PostgreSQL / Google / Cal.com / Resend / S3
```

`src/app` contiene rutas y composición. `src/components` contiene UI reutilizable. `src/data` mantiene contenido institucional editable. `src/lib` implementa infraestructura y validación. `src/server` concentra reglas de negocio y autorización. `prisma` define datos y seed.

## Áreas públicas y privadas

- `(public)`: cabecera, pie, WhatsApp, contenido indexable.
- `(auth)`: acceso y recuperación, con `noindex`.
- `portal/panel`: sesión obligatoria y acceso del cliente a sus propios registros.
- `admin`: rol `ADMIN` obligatorio.
- `api`: valida entrada, sesión, origen y propiedad antes de mutar datos.

## Agenda

La disponibilidad combina reglas configuradas, bloqueos, eventos del proveedor y reservas existentes. Una cita de 45 minutos más intervalo se descompone en segmentos; la unicidad de `resourceKey + startsAt` impide que dos solicitudes concurrentes reserven el mismo horario.

El evento externo se crea después de reservar localmente. Si Google o Cal.com falla, la cita conserva estado de sincronización pendiente para revisión, sin afirmar confirmación definitiva.

## Degradación local

Sin credenciales externas, los proveedores `mock` permiten recorrer agenda y formularios. En producción deben configurarse servicios reales. La validación de entorno evita activar DEMO, almacenamiento local o mocks de forma accidental.

## Datos no públicos

Los documentos nunca viven en `public/`. La base almacena metadatos y una clave opaca; la descarga pasa por autorización o una URL firmada de corta duración. Notas internas, estrategias y auditoría no forman parte de los DTO del cliente.
