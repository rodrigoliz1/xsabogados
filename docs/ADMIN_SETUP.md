# Creación del administrador

El seed demo no debe utilizarse para crear la cuenta real. Aplique primero las migraciones en Neon.

```bash
read -s ADMIN_INITIAL_PASSWORD
export ADMIN_INITIAL_PASSWORD
npm run admin:create -- --email administrador@xs-abogados.com --name "Nombre autorizado"
unset ADMIN_INITIAL_PASSWORD
```

La contraseña debe tener al menos 14 caracteres e incluir mayúscula, minúscula, número y símbolo. El script:

- exige `DATABASE_URL` y `DIRECT_URL`;
- crea un usuario `ADMIN` activo cuando el correo no existe;
- se niega a elevar una cuenta con otro rol;
- no imprime ni almacena la contraseña en texto plano;
- se niega a reemplazar una contraseña existente sin `--update-password`.

Para una rotación deliberada:

```bash
npm run admin:create -- --email administrador@xs-abogados.com --update-password
```

Defina nuevamente `ADMIN_INITIAL_PASSWORD` solo durante esa operación y elimínela del entorno al terminar. No la guarde como variable persistente de Vercel.
