# Permisos y jerarquía

La autorización se verifica en servidor mediante `src/server/policies`. El rol técnico (`ADMIN`, `LAWYER`, `CLIENT`) está separado del rango profesional (`PARTNER`, `ASSOCIATE`). Ocultar botones nunca sustituye una política.

| Capacidad                             | ADMIN                | PARTNER          | ASSOCIATE      | CLIENT       |
| ------------------------------------- | -------------------- | ---------------- | -------------- | ------------ |
| Crear administradores o socios        | Sí                   | No               | No             | No           |
| Crear clientes y asociados            | Sí                   | Sí               | No             | No           |
| Ver todos los asuntos                 | Sí                   | Sólo autorizados | Sólo asignados | Sólo propios |
| Gestionar asuntos                     | Sí                   | Autorizados      | Asignados      | No           |
| Gestionar disponibilidad              | Corrección funcional | Propia           | Propia         | No           |
| Crear artículos                       | Sí                   | Sí               | Sí             | No           |
| Aprobar/publicar                      | Sí                   | Sí               | No             | No           |
| Auditoría/configuración institucional | Sí                   | No               | No             | No           |

Las cuentas `SUSPENDED` y `ARCHIVED` no pueden iniciar sesión; cambiar estado incrementa `sessionVersion` e invalida sesiones activas.
