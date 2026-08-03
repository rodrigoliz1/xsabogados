# Google Calendar

## Preparación

1. Cree un proyecto institucional en Google Cloud.
2. Habilite Google Calendar API.
3. Configure pantalla de consentimiento y credenciales OAuth.
4. Autorice una cuenta institucional y obtenga un refresh token.
5. Cree un calendario exclusivo para citas de XS ABOGADOS.
6. Conceda únicamente los permisos necesarios para consultar disponibilidad y administrar eventos.

## Variables

```env
CALENDAR_PROVIDER=google
NEXT_PUBLIC_CALENDAR_PROVIDER=google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
```

Las credenciales son privadas. No use calendarios personales ni coloque tokens en variables `NEXT_PUBLIC_`.

## Comportamiento

- La aplicación consulta intervalos ocupados, crea eventos y cancela eventos mediante la API de Google.
- Las citas se guardan primero en PostgreSQL; si Google falla, se conserva la operación con estado de sincronización fallido para revisión.
- Las fechas se almacenan en UTC y se presentan en `America/Mexico_City`.
- Reprogramaciones solicitadas requieren confirmación administrativa antes de considerarse definitivas.

## Preview

Use `CALENDAR_PROVIDER=mock`. El mock está permitido cuando `VERCEL_ENV=preview` y se bloquea cuando `VERCEL_ENV=production`. Una cita mock se presenta como “Solicitud recibida”, no como evento confirmado.

Antes de Production pruebe bloqueos, horario de verano, días inhábiles, cancelación, cuenta revocada, token expirado, colisión simultánea y recuperación ante fallos de Google.
