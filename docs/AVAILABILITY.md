# Disponibilidad individual

Los abogados gestionan reglas y ausencias desde `/portal/abogado/disponibilidad`. Cada regla pertenece a un `LawyerProfile` y define día, inicio, fin, duración, intervalo, anticipación, horizonte, modalidades y límite diario opcional.

El cálculo de agenda descuenta bloqueos, reservas confirmadas, holds activos y ocupación del proveedor externo. Todas las fechas se almacenan en UTC y se muestran con `America/Mexico_City`. `LawyerAvailabilityOverride` permite horarios extraordinarios o días cerrados.
