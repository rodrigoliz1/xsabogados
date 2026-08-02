# Configuración de calendario

## Modo local

```env
CALENDAR_PROVIDER=mock
NEXT_PUBLIC_CALENDAR_PROVIDER=mock
```

El proveedor mock genera horarios de lunes a viernes, 09:00–18:00, en `America/Mexico_City`, con consultas de 45 minutos e intervalo de 15 minutos. Las validaciones rechazan fechas pasadas y colisiones.

Con PostgreSQL, `/admin/disponibilidad` permite modificar la regla global de lunes a viernes y crear o eliminar bloqueos excepcionales. Sin `DATABASE_URL`, la agenda pública usa memoria volátil y conserva los mismos valores predeterminados durante la sesión del servidor.

## Google Calendar

1. Crear un proyecto en Google Cloud.
2. Habilitar Google Calendar API.
3. Configurar pantalla de consentimiento y credenciales OAuth.
4. Obtener un refresh token para la cuenta autorizada.
5. Crear o seleccionar un calendario exclusivo para citas.
6. Añadir variables:

```env
CALENDAR_PROVIDER=google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
```

La cuenta debe tener el menor alcance necesario. No utilices calendarios personales. Verifica zona horaria, permisos, renovación del token y comportamiento cuando Google no responde.

## Cal.com

```env
CALENDAR_PROVIDER=calcom
CALCOM_API_KEY=
CALCOM_EVENT_TYPE_ID=
```

Configura el tipo de evento con la misma duración, zona horaria y reglas del sitio. Antes de producción, implementa o valida el adaptador, webhooks, autenticidad de firmas y reconciliación de cancelaciones.

## Confirmación, cancelación y reprogramación

La solicitud local se registra primero. La confirmación final depende de la política del despacho y del estado de sincronización. Los enlaces para invitados deben usar tokens aleatorios de un solo uso guardados como hash; nunca IDs de cita predecibles.

## Checklist

- Bloqueos y días inhábiles.
- Horario por profesional.
- Colisiones simultáneas.
- Cambio de horario estacional.
- Invitación y videollamada.
- Cancelación desde ambos sistemas.
- Reintentos y alertas por sincronización pendiente.
