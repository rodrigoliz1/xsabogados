# Aprobación y versionado editorial

Estados: `DRAFT`, `SUBMITTED`, `CHANGES_REQUESTED`, `APPROVED`, `PUBLISHED`, `REJECTED`, `ARCHIVED`.

Cada envío crea `ArticleRevision` inmutable y `ArticleReview`. Solicitar cambios o rechazar requiere comentarios. Aprobar registra revisor y fecha; con `ARTICLE_AUTO_PUBLISH_ON_APPROVAL=true` también publica e invalida las rutas públicas. El autor recibe notificación interna y correo transaccional prudente.

Las publicaciones muestran una firma derivada de `User`/`LawyerProfile`, con enlace al perfil público cuando existe. Los coautores se ordenan mediante `ArticleCoauthor`.
