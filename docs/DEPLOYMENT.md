# Despliegue

## Vercel

1. Crear un repositorio privado y proteger la rama principal.
2. Importarlo en Vercel con el preset Next.js.
3. Configurar Node.js 22 o superior y `npm run build`.
4. Crear PostgreSQL administrado con respaldo y cifrado.
5. Añadir variables para Production, Preview y Development con valores separados.
6. Ejecutar `npm run db:deploy` en una tarea controlada antes de servir una versión que dependa de una migración.
7. Confirmar que `ENABLE_DEMO_AUTH=false`, `CALENDAR_PROVIDER` y `EMAIL_PROVIDER` no sean `mock`, y que `STORAGE_PROVIDER` no sea `local`.
8. Probar el deployment en Preview y promoverlo después de la revisión.

## Dominio

1. Añadir `xs-abogados.com` y `www.xs-abogados.com` en Vercel.
2. Elegir `https://xs-abogados.com` como canonical.
3. Redirigir `www` al dominio principal.
4. Configurar en el registrador únicamente los registros indicados por Vercel.
5. Esperar propagación y verificar certificado HTTPS.
6. Añadir la propiedad a Google Search Console, validar `sitemap.xml` y solicitar indexación.

Los cambios DNS requieren acceso al registrador y autorización expresa; el proyecto no los ejecuta.

## Correo

1. Verificar `xs-abogados.com` en Resend.
2. Configurar SPF, DKIM y, cuando proceda, DMARC.
3. Crear un remitente transaccional y establecer `EMAIL_FROM`.
4. Confirmar `CONTACT_RECIPIENT_EMAIL`.
5. Probar recepción, respuesta automática y manejo de rebotes sin incluir información sensible.

## PostgreSQL

- Habilitar copias de seguridad y recuperación a un punto en el tiempo.
- Restringir acceso por red cuando el proveedor lo permita.
- Usar una cuenta de runtime sin permisos administrativos innecesarios.
- Revisar migraciones SQL antes de desplegarlas.
- Probar restauración periódicamente.

## Verificación de lanzamiento

- Página pública, 404, sitemap, robots, canonical y Open Graph.
- Contacto, agenda, cancelación/reprogramación y correos.
- Login, logout, recuperación y bloqueo de cuenta.
- Matriz `CLIENT`/`LAWYER`/`ADMIN` y pruebas IDOR.
- Descarga privada y límites de archivo.
- Vista móvil, teclado, contraste y reduced motion.
- Rate limiting, cookies seguras, logs sin datos personales y alertas operativas.

## Redirección del sitio anterior

Las redirecciones entre dominios deben configurarse en el hosting de `ariassilva.com` o cuando ese dominio apunte al nuevo proyecto. Mapeos mínimos: `/nosotros/` a `/equipo`, `/areas-de-especializacion/` a `/areas`, `/contacto/` a `/contacto` y `/aviso-de-privacidad/` a su equivalente. El área inmobiliaria antigua debe dirigir a `/areas` hasta que la firma confirme si continúa vigente.
