import { mkdir, rm, cp } from 'node:fs/promises';
const destination = new URL('../dist/', import.meta.url);
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const path of ['index.html', 'productos.json', 'config.json', 'js', 'img', 'css/output.css']) {
  await cp(new URL(`../${path}`, import.meta.url), new URL(path, destination), { recursive: true });
}
console.log('Sitio estático listo en dist/');
