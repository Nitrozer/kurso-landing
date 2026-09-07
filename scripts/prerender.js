import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// La page est entierement statique : on la peint au build plutot que
// d'attendre que React demarre chez le visiteur.
const { render } = await import('../dist-ssr/entry-server.js')
let html = readFileSync('dist/index.html', 'utf8')
html = html.replace('<!--app-html-->', render())

// La feuille de style tient en 2 Ko compresses : la mettre en ligne evite
// un aller-retour qui bloquait le premier rendu pendant ~700 ms.
const cssFile = readdirSync('dist/assets').find(f => f.endsWith('.css'))
if (cssFile) {
  const css = readFileSync(join('dist/assets', cssFile), 'utf8')
  html = html
    .replace(new RegExp(`<link rel="stylesheet"[^>]*${cssFile}[^>]*>`), '')
    .replace('</head>', `<style>${css}</style></head>`)
}

// L'image du heros est l'element LCP : le navigateur ne doit pas attendre
// d'avoir lu le HTML pour la demander.
html = html.replace('</head>',
  '<link rel="preload" as="image" type="image/avif" ' +
  'imagesrcset="/img/gribou.avif 1x, /img/gribou@2x.avif 2x" fetchpriority="high"></head>')

writeFileSync('dist/index.html', html)
rmSync('dist-ssr', { recursive: true, force: true })
console.log('  pre-rendu + CSS en ligne + prechargement du heros')
