# Imágenes editoriales

Neon sólo conserva metadatos de `MediaAsset`; nunca el binario. La subida requiere `LAWYER` o `ADMIN`, límite configurable, MIME compatible y una imagen que Sharp pueda decodificar.

El pipeline corrige orientación, elimina metadatos al recodificar, limita dimensiones y genera WebP grande y miniatura con claves aleatorias. Guarda checksum, dimensiones, tamaño, texto alternativo y variantes. En Production debe configurarse almacenamiento S3 compatible; `local` se rechaza en producción pública.

La imagen destacada se carga desde el editor guiado y se vincula al borrador por el identificador de `MediaAsset`. La ruta pública de medios sólo entrega activos `READY` asociados a un artículo `PUBLISHED`, con `nosniff` y caché controlada.
