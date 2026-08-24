# Creación del administrador

El seed demo no debe utilizarse para crear la cuenta real. Aplique primero las migraciones en Neon.

```bash
read -s ADMIN_INITIAL_PASSWORD
export ADMIN_INITIAL_PASSWORD
npm run admin:create -- --email administrador@xs-abogados.com --name "Nombre autorizado"
unset ADMIN_INITIAL_PASSWORD
```

La contraseña debe tener 12–72 bytes UTF-8, no estar en la lista bloqueada y ser única; se recomienda una frase larga generada por un gestor. El script:

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

Las cuentas ordinarias se crean desde `/admin/usuarios` mediante invitación individual. El sistema conserva la cuenta aunque Brevo falle y deja el correo en `/admin/correos` para reintento. ADMIN puede suspender, reactivar o archivar sin borrar relaciones; cada cambio invalida sesiones y queda auditado.
