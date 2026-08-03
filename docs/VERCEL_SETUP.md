# Configuración de Vercel

## Importación

1. Conecte GitHub e importe `rodrigoliz1/xsabogados`.
2. Seleccione Framework `Next.js`.
3. Use Root Directory `./`.
4. Configure Install Command `npm ci`.
5. Configure Build Command `npm run build`.
6. No configure Output Directory.
7. Seleccione Node.js `22.x`.

## Preview

Añada las variables de Neon Preview, Brevo y seguridad. Use calendario mock. Puede activar demo manualmente. Si omite `NEXT_PUBLIC_SITE_URL`, los enlaces del servidor utilizan `VERCEL_URL`; si la establece, debe ser la URL exacta del Preview. Despliegue y confirme que el header `X-Robots-Tag` impide indexación.

Después de crear Neon Preview:

```bash
npm run db:deploy
```

## Production

Añada variables independientes de Production, aplique migraciones deliberadamente y desactive demo/mock. Establezca `NEXT_PUBLIC_SITE_URL=https://xs-abogados.com`.

Conecte `xs-abogados.com` y `www.xs-abogados.com` después de aprobar el Preview. Configure los registros indicados por Vercel, verifique HTTPS y redirija `www` al dominio principal. Realice un redeploy tras cualquier cambio relevante de variables.

No modifique manualmente `VERCEL_ENV`, `VERCEL_URL` ni `VERCEL_PROJECT_PRODUCTION_URL`; Vercel las inyecta.
