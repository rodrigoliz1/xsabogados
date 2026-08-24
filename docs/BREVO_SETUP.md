# Brevo transaccional

Brevo se utiliza exclusivamente para mensajes operativos: citas, contacto, recuperación de acceso, cancelaciones y reprogramaciones. La aplicación no crea contactos, listas, campañas, newsletters ni automatizaciones comerciales.

## Configuración

1. Cree la cuenta Brevo institucional.
2. Cree el remitente `notificaciones@xs-abogados.com` o el remitente finalmente aprobado.
3. Verifique `xs-abogados.com` desde el panel de Brevo.
4. Copie exactamente los registros DNS que Brevo muestre para DKIM y SPF; no invente valores.
5. Configure DMARC de forma gradual y conforme a la política del dominio.
6. Espere la validación del dominio/remitente.
7. Cree una API key con el menor alcance operativo disponible.
8. Guárdela en Vercel como `BREVO_API_KEY`; nunca en GitHub o una variable `NEXT_PUBLIC_`.

La API key no es una contraseña SMTP. Esta integración utiliza la API transaccional oficial mediante `@getbrevo/brevo`, no SMTP.

## Variables

```env
EMAIL_PROVIDER=brevo
BREVO_API_KEY=
EMAIL_FROM_ADDRESS=notificaciones@xs-abogados.com
EMAIL_FROM_NAME="XS ABOGADOS"
EMAIL_REPLY_TO=
CONTACT_RECIPIENT_EMAIL=contacto@xs-abogados.com
BREVO_SANDBOX_MODE=true
EMAIL_CRON_SECRET=
DATA_ENCRYPTION_KEY_VERSION=v1
DATA_ENCRYPTION_KEY_CURRENT=
```

Use sandbox en las primeras pruebas de Preview. Después pruebe una entrega real a destinatarios autorizados y establezca `BREVO_SANDBOX_MODE=false` en Production.

`CONTACT_RECIPIENT_EMAIL` es la bandeja interna que recibe solicitudes de contacto y citas. Puede ser distinta del remitente.

## Prueba y operación

1. Envíe un formulario de contacto de prueba.
2. Solicite una cita de prueba.
3. Compruebe el acuse al solicitante y la notificación al despacho.
4. Pruebe recuperación de contraseña y enlaces absolutos.
5. Pruebe cancelación y reprogramación.
6. Revise los logs transaccionales de Brevo, rebotes y bloqueos.
7. Configure el cron autenticado de `/api/cron/email-outbox` y revise `/admin/correos`; los fallos usan backoff/dead letter y ADMIN puede reencolarlos con auditoría.

La carga del outbox se cifra con AES-256-GCM y se limpia al alcanzar un estado terminal. Los errores guardados son deliberadamente genéricos: no incluyen API keys, tokens, cuerpos remotos ni información jurídica completa.

Además de contacto, citas y recuperación, Brevo entrega invitaciones de cuenta, activación, avances visibles, avisos de mensaje, propuestas de cita y decisiones editoriales. Son correos exclusivamente transaccionales; no se crean campañas, listas ni automatizaciones comerciales.
