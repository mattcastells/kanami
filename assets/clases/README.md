# Imágenes de los apuntes de clase

Acá van las imágenes que aparecen en las clases (`content/clases/kurasu-NN.md`) y en la
hoja de repaso (`content/repaso.md`): fotos del pizarrón, páginas del みんなの日本語,
diagramas dibujados en clase.

## Cómo agregar una

1. Dejá el archivo en esta carpeta. Convención de nombre: `kurasu-NN-<que-es>.png`
   (por ejemplo `kurasu-14-grupos-verbos.png`). Para el repaso: `repaso-<que-es>.png`.
   Formatos: `.png`, `.jpg`, `.webp`.
2. Referencialo desde el markdown de la clase, en la sección que corresponda:

   ```markdown
   ## Grupos de verbos | どうし の グループ

   ![Cuadro de los 3 grupos que hizo la profe en el pizarrón](kurasu-14-grupos-verbos.png)
   ```

   El texto entre corchetes es el epígrafe: se muestra debajo de la imagen y se usa
   como etiqueta de accesibilidad. Puede quedar vacío (`![](archivo.png)`), pero
   conviene escribirlo.
3. Regenerá el dataset:

   ```bash
   npm run clases:generate
   ```

   Eso actualiza `src/data/classNotes.generated.ts` y `src/data/classImages.generated.ts`.
   Si el archivo referenciado no existe, el script **falla con el nombre del archivo**
   en vez de dejar un hueco silencioso en el apunte.

## Por qué hay un mapa generado

Metro (el bundler de React Native) resuelve los assets en tiempo de build: `require()`
tiene que recibir una ruta literal, no una variable. Por eso el markdown guarda solo el
nombre del archivo y el generador escribe el `require()` de cada imagen en
`src/data/classImages.generated.ts`. Ese archivo no se edita a mano.

## En la app

Las imágenes se renderizan con `src/components/study/ClassImage.tsx`: respetan la
relación de aspecto original y se abren a pantalla completa al tocarlas.
