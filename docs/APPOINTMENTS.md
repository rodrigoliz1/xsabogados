# Citas negociables e ICS

Una solicitud pública crea `Appointment`, una primera `AppointmentProposal` y un `AppointmentHold` temporal. Nunca queda confirmada automáticamente. Los estados distinguen revisión del abogado/cliente, propuestas de cada parte, confirmación, rechazo y cierre.

Cada propuesta sustituye la pendiente anterior y retiene el horario durante `APPOINTMENT_HOLD_MINUTES`. La aceptación debe provenir de la contraparte. Al aceptar se vuelven a comprobar colisiones, se consolidan slots de reserva, se registra `acceptedById`, se incrementa la secuencia ICS y sólo entonces se intenta crear el evento externo.

Una cita confirmada permite descargar `/api/portal/citas/:id/ics`. El archivo contiene UID, secuencia, UTC, modalidad y ubicación prudente; no contiene la descripción jurídica. La descarga exige acceso a la cita.
