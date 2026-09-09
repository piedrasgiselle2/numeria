# Numeria · Clase 1

Primera clase de una secuencia didáctica gamificada sobre proporcionalidad y porcentajes para 1.º año de ESB.

## Qué incluye

- Introducción narrativa a la aldea de Numeria.
- Creador visual de personaje con base, cabello, vestimenta, accesorio, oficio y nombre ficticio.
- Presentación del "Diario del Aventurero" para trabajar en la carpeta.
- Cuatro situaciones diagnósticas.
- Registro de respuestas en el navegador.
- Cierre metacognitivo.
- Mapa de Numeria con la próxima misión desbloqueada.
- Exportación CSV de las respuestas de la sesión.

## Enfoque didáctico

La Clase 1 funciona como diagnóstico inicial. La web no enseña procedimientos ni muestra las soluciones durante la misión. Se pide que cada estudiante registre su procedimiento en la carpeta antes de ingresar la respuesta.

Esto permite conservar dos fuentes de información:
1. La respuesta registrada digitalmente.
2. El procedimiento escrito en el Diario del Aventurero.

## Publicar con GitHub Pages

1. Creá un repositorio nuevo en GitHub.
2. Subí `index.html`, `styles.css` y `script.js`.
3. Entrá en **Settings > Pages**.
4. En **Build and deployment**, elegí **Deploy from a branch**.
5. Seleccioná `main` y la carpeta `/root`.
6. Guardá.

GitHub mostrará luego la dirección pública de la página.

## Importante para uso en investigación

El sitio guarda el progreso únicamente en `localStorage` del navegador. No envía datos a ningún servidor.

El CSV incluye el nombre ficticio del aventurero, personaje, número de desafío, respuesta y fecha/hora. Para una implementación real con estudiantes conviene definir previamente qué datos se recolectarán y cómo se resguardarán según el diseño metodológico de la investigación.

## Archivos

- `index.html`
- `styles.css`
- `script.js`


## Personalización del personaje

La apariencia elegida se guarda en `localStorage` junto con el progreso. Esto permite reutilizar el mismo personaje en futuras clases si se mantiene la misma clave de almacenamiento.
