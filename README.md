# STLN3D

Catálogo estático en español de Perú, con Tailwind compilado y JavaScript vanilla. Sin backend ni claves. Los tres productos y sus precios son ejemplos; las imágenes SVG son ilustraciones locales de muestra, no fotos de productos reales.

## Desarrollo

Requiere Node.js 20 o posterior.

```sh
npm install
npm run build
npm run dev
```

Abre http://127.0.0.1:4173. En PowerShell, usa `npm.cmd` si la política de ejecución bloquea `npm.ps1`. No abras index.html con doble clic: el catálogo necesita HTTP para cargar el JSON. Tras editar estilos, ejecuta de nuevo `npm run build`, o usa `npx tailwindcss -i css/input.css -o css/output.css --watch` en otra terminal.

## Configurar pedidos

Edita `config.json`: asigna a `whatsapp` tu número peruano real con código 51 y nueve dígitos, sin espacios ni signo +. Mientras esté vacío, la tienda permite explorar y armar el carrito, pero no enviar pedidos. El mensaje incluye producto, color, cantidad, subtotal y consulta de envío y pago. El envío no está incluido en el subtotal. No se borra el carrito al abrir WhatsApp.

El carrito se guarda en `localStorage`; si el navegador no lo permite, funciona en memoria durante la sesión. Al recargar se descartan productos retirados, colores inexistentes y cantidades inválidas. Máximo: 99 unidades por combinación de producto y color.

## Editar catálogo

Agrega fotos propias en `img/` (WebP, hasta unos 1200 px y 100 KB) y edita `productos.json`. Cada producto requiere un id único con minúsculas, números o guiones; nombre, categoría, precio numérico, imágenes locales, colores, descripción, disponible y destacado. Las rutas de imágenes tienen el formato `img/archivo.webp`, sin subcarpetas. Las categorías se generan del catálogo. Los destacados aparecen primero; los no disponibles se muestran sin permitir agregarlos.

Las ilustraciones SVG incluidas son originales de muestra. Sustitúyelas por fotos y confirma que los diseños reales sean propios o tengan licencia comercial antes del lanzamiento.

## Comprobaciones

```sh
npm test
npm run build
```

Comprueba en navegador:

- Buscar “orbita” encuentra “Órbita”; combinar búsqueda y categoría funciona.
- Agregar distintos colores, cambiar cantidades, quitar y recargar conserva el pedido correcto.
- Cambiar un color en el carrito fusiona las líneas del mismo producto y color.
- Abrir detalle, cambiar imagen y cerrar con Escape; los diálogos contienen el foco.
- Configurar un número real y revisar el mensaje de WhatsApp desde un celular.
- Revisar en iPhone y Android, incluyendo anchos de 360 px y navegación con teclado.

## Publicar en Cloudflare Pages

1. Crea un repositorio **privado** en GitHub y sube esta carpeta como raíz del repositorio. No subas node_modules ni dist.
2. En Cloudflare Pages, conecta ese repositorio y selecciona su rama de producción.
3. Usa `npm ci && npm run build` como comando de compilación y `dist` como directorio de salida. No requiere framework. Si el repositorio contiene una carpeta superior, configura también el directorio raíz correspondiente.
4. Comprueba el despliegue en el subdominio asignado y luego configura tu dominio elegido desde el panel de Cloudflare.
5. Reemplaza `og:image` por una imagen PNG/JPEG de 1200 × 630 px alojada en una URL HTTPS absoluta del dominio final. El SVG local actual es una plantilla y su compatibilidad en redes es limitada. Agrega `og:url` y canonical con ese dominio.

La versión de prueba en Cloudflare está publicada en https://stln3d.pages.dev/.

## Publicar en GitHub Pages

El workflow `.github/workflows/pages.yml` compila y prueba el sitio, y publica únicamente `dist/` al subir cambios a `main`. También permite ejecutar el despliegue manualmente desde Actions.

1. Abre https://github.com/StolenCorp/STLN3D/settings/pages y elige **GitHub Actions** como Source en Build and deployment.
2. Si GitHub solicita un cambio de plan, Pages desde este repositorio privado requiere GitHub Pro para esta cuenta personal. La alternativa es cambiar explícitamente la visibilidad del repositorio a público. El workflow no cambia esa visibilidad.
3. En Actions, selecciona **Deploy GitHub Pages → Run workflow → main** para desplegar después de activar Pages.
4. Espera a que build y deploy terminen correctamente y abre https://stolencorp.github.io/STLN3D/.

Las rutas de recursos son relativas para funcionar bajo `/STLN3D/`. Cloudflare mantiene su despliegue independiente. La dirección de GitHub Pages solo estará activa tras habilitar el servicio y completar el primer despliegue. Consulta las restricciones de uso comercial de GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits.

## Antes de lanzar

- Configurar el WhatsApp real y probar el pedido de extremo a extremo.
- Cargar al menos diez productos reales, fotos WebP y precios confirmados.
- Verificar las licencias comerciales y acordar pago, entrega y tiempos de producción.
- Reemplazar la imagen social y comprobar su vista previa.
- Probar en dispositivos reales y confirmar el dominio.

`npm run build` genera únicamente archivos públicos en `dist/`. Nunca incluyas tokens ni claves en el catálogo o la configuración.
