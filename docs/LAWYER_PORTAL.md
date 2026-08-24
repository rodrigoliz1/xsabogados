# Portal profesional

Ruta base: `/portal/abogado`. Requiere una cuenta `LAWYER`, estado `ACTIVE` y `LawyerProfile` activo para acceder a asuntos.

Incluye resumen, asuntos asignados, detalle interno autorizado, chat persistente, citas negociables, disponibilidad propia, artículos y perfil. Un asociado nunca puede acceder a un asunto ajeno cambiando el identificador: la consulta se filtra por `MatterAssignment` en servidor.

Los mensajes se guardan antes del correo, usan rate limiting y una ventana de enfriamiento configurada por `MESSAGE_EMAIL_COOLDOWN_MINUTES`. El correo sólo avisa que existe un mensaje; el contenido completo permanece en el portal.
