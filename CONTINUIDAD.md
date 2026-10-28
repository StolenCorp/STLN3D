# STLN3D — Contexto para continuar en otro dispositivo

Actualizado: 28 de octubre de 2026 (America/Bogota).

Este documento resume la conversación de implementación en la extensión de Codex de Visual Studio Code. No es una transcripción completa ni sincroniza el hilo original. Permite retomar el proyecto en una conversación nueva con acceso al repositorio.

## Inicio rápido para el siguiente chat

Copia este mensaje en Codex en el otro dispositivo:

> Continuemos el proyecto STLN3D del repositorio https://github.com/StolenCorp/STLN3D. Lee CONTINUIDAD.md y README.md, revisa el estado actual del repositorio y retoma desde los pendientes. La tienda ya está publicada en GitHub Pages y Cloudflare Pages. Conserva HTML, JavaScript vanilla, Tailwind compilado y el catálogo en productos.json. Antes de modificar datos comerciales, solicita los datos reales que falten. No inventes el número de WhatsApp, precios definitivos ni fotos reales. Comunícate en español.

Si el nuevo entorno no tiene acceso al repositorio, conecta GitHub y autoriza STLN3D, o clónalo en el equipo y abre la carpeta con VS Code.

## Objetivo y decisiones

- Marca: STLN3D, productos impresos en 3D, Lima, Perú.
- Referencia funcional: https://node3d-arq.github.io/store/.
- Crear un catálogo estático: el cliente selecciona productos, colores y cantidades y envía el pedido completo por WhatsApp.
- HTML, CSS con Tailwind CLI y JavaScript vanilla. Sin framework ni backend.
- Precios en soles, formato `S/ 35.00`; textos en español de Perú.
- Catálogo editable en `productos.json`; imágenes finales en WebP, aproximadamente hasta 1200 px y 100 KB.
- Sin pagos en línea, cuentas de clientes ni stock en tiempo real.
- Productos propios o con licencia comercial; no usar personajes o marcas de terceros sin autorización.
- No incluir secretos ni claves en archivos públicos.

## Repositorio y sitios

- Repositorio: https://github.com/StolenCorp/STLN3D
- Rama principal: `main`.
- GitHub Pages: https://stolencorp.github.io/STLN3D/
- Cloudflare Pages: https://stln3d.pages.dev/
- Ambos sitios fueron publicados. Se verificaron por HTTP, no mediante una prueba visual completa en navegador.
- El usuario solicitó expresamente la dirección `github.io` y activó Pages con GitHub Actions desde su cuenta.
- El repositorio era privado en la última consulta de metadatos anterior a activar GitHub Pages. No se verificó si después cambió la visibilidad o el plan de la cuenta. No asumir ni cambiar su visibilidad.
- Se explicó la restricción de GitHub Pages para alojar negocios/tiendas destinados principalmente a facilitar transacciones. El usuario decidió continuar con GitHub Pages de todas formas. Cloudflare sigue publicado.
- El dominio propio todavía no está decidido; se consideró `3d.stolen.pe`.

## Qué está implementado

1. Base del proyecto y compilación de Tailwind, sin CDN.
2. Catálogo desde JSON con tres productos de muestra: Maceta Geo, Organizador Órbita y Soporte Arco.
3. Buscador por nombre que ignora acentos y mayúsculas, combinado con filtros de categoría generados desde el catálogo.
4. Carrito lateral con cantidades y colores, subtotal, eliminación, persistencia en localStorage y fusión de combinaciones repetidas.
5. Mensaje de WhatsApp con producto, cantidad, color y subtotal; apertura en `wa.me`.
6. Detalle de producto con galería, destacados primero, favicon y metadatos básicos.
7. Diseño adaptable con tonos arena y verde e ilustraciones SVG originales de muestra.
8. Despliegues en Cloudflare Pages y GitHub Pages.

Las fases 1 a 4 del plan están implementadas, pero falta la prueba real de pedido. La fase 5 requiere fotos y metadatos definitivos y pruebas visuales. La fase 6 tiene publicación funcional, con dominio propio y validación de lanzamiento pendientes.

## Archivos importantes

| Archivo | Función |
| --- | --- |
| `index.html` | Página única, secciones, diálogos y SEO |
| `productos.json` | Catálogo de muestra |
| `config.json` | Número de WhatsApp público, actualmente vacío |
| `js/app.js` | Renderizado, filtros, galería y eventos de carrito |
| `js/cart.js` | Limpieza del carrito, total y formato del pedido |
| `css/input.css` | Fuente Tailwind y estilos propios |
| `css/output.css` | CSS compilado |
| `img/` | SVG de muestra y favicon |
| `scripts/build.js` | Copia únicamente los archivos públicos a `dist/` |
| `scripts/serve.js` | Servidor de desarrollo local, puerto 4173 |
| `tests/cart.test.js` | Pruebas de lógica del carrito y búsqueda |
| `.github/workflows/pages.yml` | Compila, prueba y publica `dist/` en GitHub Pages |
| `README.md` | Instrucciones técnicas y de publicación |

`CONTINUIDAD.md` no se incluye en `dist/`, por lo que el build no lo publica en las tiendas. Su acceso en GitHub depende de la visibilidad del repositorio.

## Comportamientos y límites actuales

- `config.json` contiene `"whatsapp": ""`. No existe todavía un número real proporcionado por el usuario.
- Mientras no haya un número peruano válido (`51` seguido de nueve dígitos), el botón de pedido está deshabilitado y muestra tienda en preparación.
- Los precios y productos son ejemplos. El catálogo avisa que son referenciales.
- Las imágenes son ilustraciones SVG, no fotos WebP; deben reemplazarse antes del lanzamiento comercial.
- Máximo 99 unidades por combinación de producto y color. Cambiar a un color ya presente fusiona las líneas.
- Al restaurar el carrito se descartan productos retirados/no disponibles y variantes inválidas. Si localStorage falla, se usa memoria durante la sesión.
- Envío, pago y disponibilidad se confirman por WhatsApp. El subtotal no incluye envío.
- El carrito no se borra al abrir WhatsApp.
- Los recursos usan rutas relativas para funcionar dentro de `/STLN3D/`.
- `og:image` es todavía `img/social.svg`; falta una imagen PNG/JPEG con URL HTTPS absoluta y definir canonical/og:url del dominio preferido.

## Desarrollo desde otra computadora

```sh
git clone https://github.com/StolenCorp/STLN3D.git
cd STLN3D
npm ci
npm run build
npm run dev
```

Abre http://127.0.0.1:4173/ mientras el servidor esté activo. No abrir el HTML con doble clic: `fetch` necesita HTTP. En Windows PowerShell, usar `npm.cmd` si `npm.ps1` está bloqueado por la política de ejecución.

La copia original estaba en `D:\Developer\Claude\STLN3D\STLN3D`; esa ruta no existe necesariamente en el otro dispositivo. El servidor local original puede estar apagado: iniciarlo en el equipo en uso.

```sh
npm test
npm run build
```

Cloudflare usa `npm ci && npm run build`, salida `dist`, raíz del repositorio, framework None y rama `main`. GitHub Actions usa Node 24, ejecuta pruebas y build y despliega solamente `dist/`. Un push a `main` dispara ambos despliegues.

## Validación realizada

- Compilación de Tailwind y generación de `dist/` correctas.
- Tres pruebas de Node pasan: saneamiento/fusión de carrito, totales/mensaje de WhatsApp y normalización de búsqueda.
- Verificación HTTP local correcta.
- Cloudflare respondió HTTP 200 para la página, catálogo, estilos, JavaScript y configuración.
- GitHub Pages respondió HTTP 200 para página, catálogo (3 productos), CSS, ambos módulos JS, configuración e imagen de Maceta Geo.
- No se ha completado QA visual automatizado ni prueba en iPhone/Android real.
- No se ha enviado un pedido a un número real ni confirmado su recepción.

Commits anteriores a este documento:

- `258a5ec`: implementación inicial del catálogo y carrito.
- `0fc4128`: workflow de GitHub Pages y documentación.

## Pendientes, en orden práctico

1. Pedir al usuario el número de WhatsApp real, configurarlo y probar el pedido completo desde un celular.
2. Recibir catálogo real: nombres, categorías, precios, colores, medidas, descripciones, disponibilidad, destacados y fotos. El plan propone al menos diez productos.
3. Sustituir ilustraciones por fotos WebP optimizadas y retirar el aviso de muestra cuando corresponda.
4. Confirmar medios de pago, cobertura/costo de envío y tiempos de producción.
5. Revisar visualmente en móvil y escritorio: filtros combinados, galería, foco/teclado, carrito, persistencia y WhatsApp.
6. Elegir URL principal y, si se desea, configurar dominio propio.
7. Completar imagen social, canonical y og:url, y verificar vista previa al compartir.
8. Solo después de la revisión, anunciar la tienda y colocar el enlace en Instagram/WhatsApp Business.

## Continuidad de la conversación

El usuario aclaró que este trabajo ocurre en la extensión de Codex de VS Code, no en el chat web ni en la aplicación de escritorio de ChatGPT. Las instrucciones anteriores sobre Settings > Connections de la app de escritorio no resolvían su caso. No afirmar que este hilo local se sincroniza automáticamente con ChatGPT web.

Este archivo es el mecanismo acordado para continuar desde otro equipo o una conversación nueva. No es necesario reiniciar la implementación: el código y los despliegues ya existen. Leer el estado real del repositorio al retomar y conservar los cambios posteriores a este resumen.
