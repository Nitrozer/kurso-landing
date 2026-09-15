import { readFileSync, writeFileSync, rmSync, readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

// La page est entierement statique : on la peint au build plutot que
// d'attendre que React demarre chez le visiteur.
const { render, renderPrivacy } = await import('../dist-ssr/entry-server.js')
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

// La page de confidentialite : meme feuille de style, et PAS une ligne de
// JavaScript. Elle n'a rien d'interactif, et une page qui explique qu'on ne
// piste personne ne devrait pas avoir besoin d'executer du code pour le dire.
const legalCss = cssFile ? readFileSync(join('dist/assets', cssFile), 'utf8') : ''
const legal = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confidentialité — Kurso</title>
    <meta name="description" content="Ce que Kurso enregistre quand tu rejoins la liste d'attente : une adresse, une origine de clic, une date. Aucun cookie, aucun traceur." />
    <meta name="theme-color" content="#F6F8FF" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preload" href="/fonts/baloo2-800.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/nunito-700.woff2" as="font" type="font/woff2" crossorigin />
    <style>${legalCss}</style>
  </head>
  <body><div id="root">${renderPrivacy()}</div></body>
</html>`
mkdirSync('dist/confidentialite', { recursive: true })
writeFileSync('dist/confidentialite/index.html', legal)

rmSync('dist-ssr', { recursive: true, force: true })
console.log('  pre-rendu + CSS en ligne + prechargement du heros')
console.log('  /confidentialite ecrite, sans JavaScript')
