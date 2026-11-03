/**
 * Gera os ícones do PWA e as versões otimizadas da marca a partir dos
 * arquivos originais em `design-assets/`.
 *
 * Uso: npm run icons
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = (name) => path.join(root, 'design-assets', name)
const iconsDir = path.join(root, 'public', 'icons')
const brandDir = path.join(root, 'public', 'brand')

await mkdir(iconsDir, { recursive: true })
await mkdir(brandDir, { recursive: true })

const icon = sharp(source('logo-icon.png'))
const wordmark = sharp(source('logo-wordmark.png'))

// Marca usada na interface
await wordmark.clone().resize({ width: 800 }).png({ quality: 90 }).toFile(path.join(brandDir, 'logo-wordmark.png'))
await icon.clone().resize({ width: 256 }).png({ quality: 92 }).toFile(path.join(brandDir, 'logo-icon.png'))

// Ícones PWA
await icon.clone().resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192.png'))
await icon.clone().resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512.png'))
await icon.clone().resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'))
await icon.clone().resize(32, 32).png().toFile(path.join(iconsDir, 'favicon-32.png'))

// Maskable: o conteúdo precisa caber na zona segura (círculo central de 80%)
const maskableSize = 512
const inner = 400
const resized = await icon.clone().resize(inner, inner).png().toBuffer()
await sharp({
  create: {
    width: maskableSize,
    height: maskableSize,
    channels: 4,
    background: '#150a24',
  },
})
  .composite([{ input: resized, left: (maskableSize - inner) / 2, top: (maskableSize - inner) / 2 }])
  .png()
  .toFile(path.join(iconsDir, 'maskable-512.png'))

console.log('Ícones gerados em public/icons e public/brand.')
