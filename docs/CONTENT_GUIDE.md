# Guía de contenido e imágenes

## Fuentes editables

- Equipo: `src/data/lawyers.ts`.
- Áreas: `src/data/practice-areas.ts`.
- Perspectivas: `src/data/articles.ts`.
- Teléfono, correo, domicilio y navegación: `src/config/site.ts` y variables públicas.

Mantén español mexicano profesional, frases directas y afirmaciones comprobables. No uses promesas de resultado, rankings no acreditados, premios, cifras o testimonios inventados.

## Retratos detectados

Los originales permanecen sin cambios dentro de `IMAGENES/IMAGENES ABOGADOS`. Se copiaron y optimizaron versiones WebP en `public/images/team`:

- Víctor Silva: `victor-silva.webp`.
- Alejandro Guerrero: `alejandro-guerrero.webp`.
- Isamar Torres: `isamar-torres.webp`.
- Fernando Velasco: `fernando-velasco.webp`.
- Rodrigo Lizárraga: `rodrigo-lizarraga.webp`.

Pendientes: Felipe Ibarra Ibarra y José Luis Ahumada. La interfaz utiliza monogramas institucionales `FII` y `JLA`, sin rostros ficticios ni leyendas públicas poco profesionales.

## Sustituir una fotografía

1. Obtener aprobación de la persona y del despacho.
2. Preparar una imagen cuadrada, idealmente 1600×1600 o superior, con fondo sobrio y encuadre consistente.
3. Guardar el original fuera de `public`.
4. Crear una copia WebP de 900×900 en `public/images/team`.
5. Añadir `image` e `imageAlt` en el perfil correspondiente.
6. Revisar rostro, recorte, contraste, móvil y texto alternativo.

No alterar rasgos ni generar rostros con IA.

## Marca

Los logos fuente permanecen en `IMAGENES/LOGOS`. `scripts/process-assets.mjs` genera una versión con fondo transparente, favicon y copias optimizadas. No sustituir el símbolo sin aprobación de identidad.

## Artículos

Los tres artículos iniciales están marcados como contenido de muestra editable. Antes de publicar un artículo: confirmar autor, fecha, área, fuentes, alcance, revisión jurídica, aviso informativo, metadata y relacionados.

## Información institucional pendiente

El domicilio, correo y horarios son configurables. La dirección del sitio anterior era inconsistente y no debe reutilizarse. El valor inicial de Torre Celtis proviene del encargo y debe confirmarse antes del lanzamiento.
