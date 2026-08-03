# Neon y Prisma

## Crear los entornos

1. Cree un proyecto Neon en una región próxima a Vercel y al público principal.
2. Mantenga una rama/base `production` para Vercel Production.
3. Cree una rama/base `preview` o `staging` para Vercel Preview.
4. No comparta datos reales entre Preview y Production.

Para un borrador sin información real puede utilizarse temporalmente una base vacía común, pero debe separarse antes de incorporar clientes o expedientes.

## Conexiones

En cada entorno copie:

- La conexión pooled, normalmente con `-pooler`, a `DATABASE_URL`. Es la conexión utilizada por las funciones de Vercel.
- La conexión directa a `DIRECT_URL`. Prisma la utiliza para migraciones controladas.

No escriba estas URLs en código, documentación, mensajes o variables `NEXT_PUBLIC_`.

## Aplicar migraciones

```bash
npm ci
npm run db:generate
npm run db:deploy
```

Ejecute el comando con las variables del entorno correcto. Revise previamente el SQL en `prisma/migrations`. No utilice `prisma db push` como sustituto del historial de migraciones y no ejecute `prisma migrate dev` contra Production.

## Crear el administrador

```bash
read -s ADMIN_INITIAL_PASSWORD
export ADMIN_INITIAL_PASSWORD
npm run admin:create -- --email administrador@xs-abogados.com
unset ADMIN_INITIAL_PASSWORD
```

La contraseña debe tener al menos 14 caracteres e incluir mayúscula, minúscula, número y símbolo. El script no la imprime. No conserve `ADMIN_INITIAL_PASSWORD` en Vercel.

## Seed y Prisma Studio

- No ejecute el seed en Production. `VERCEL_ENV=production` lo bloquea.
- El seed requiere `ALLOW_DATABASE_SEED=true` y contraseñas demo proporcionadas por variables privadas.
- Use `npm run db:studio` solo desde una estación autorizada; cierre la sesión al terminar y evite editar datos sensibles sin un procedimiento aprobado.
- Active respaldos, recuperación a un punto en el tiempo y alertas de consumo en Neon.
