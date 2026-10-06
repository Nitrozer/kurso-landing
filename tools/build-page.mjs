// Transforme la maquette en page reelle.
//
// La regle de ce fichier : ne JAMAIS reecrire un style. Les styles en ligne
// de la maquette sont recopies caractere pour caractere, parce que c'est la
// seule facon d'etre au pixel pres. On ne touche qu'a ce que le harnais de
// la maquette apportait et que le site doit fournir autrement :
//
//   style-hover / -focus / -active  ->  de vraies regles CSS
//   onClick="{{ nom }}"             ->  data-on-click="nom"
//   <sc-if value="{{ nom }}">       ->  un bloc que le script montre ou cache
//   <sc-for list="{{ confetti }}">  ->  les 16 elements, ecrits au build
//   chemins des images et du modele ->  /img, /video, /3d
//
// Relancer apres chaque nouvelle version de la maquette : `npm run page`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = readFileSync(join(root, 'maquette/site-v3.dc.html'), 'utf8')

// ---------------------------------------------------------------- le gabarit
const open = src.indexOf('<x-dc>') + '<x-dc>'.length
const scriptAt = src.indexOf('<script type="text/x-dc"')
let tpl = src.slice(open, scriptAt)

// Le <helmet> part : la tete de page est ecrite a la main plus bas, avec les
// polices servies depuis ce domaine et les metadonnees du site.
tpl = tpl.replace(/<helmet>[\s\S]*?<\/helmet>\s*/, '')

// Le script du composant, repris tel quel — a une exception pres, plus bas :
// la maquette chargeait la scene 3D et three.js depuis des URL relatives au
// document et des CDN. Sur le site, les deux sont empaquetes.
const scriptEnd = src.lastIndexOf('</script>')
let logic = src.slice(src.indexOf('>', scriptAt) + 1, scriptEnd).trim()

const before = logic
logic = logic
  .replace("import(new URL('site/gribou-stage.js?v=7', base).href)", "import('./gribou-stage.js')")
  .replace("new URL('gribou3d/v2/Gribou_Kurso_v2.glb', base).href", "'/3d/Gribou_Kurso_v2.glb'")
if (logic === before) throw new Error('le chargement de la scene 3D n a pas ete trouve : la maquette a change')

// ------------------------------------------------------- les confettis, ecrits
// La maquette les calculait a chaque rendu. Le calcul est deterministe : on le
// fait une fois ici, et la page n'a plus de boucle a executer au chargement.
function confettis() {
  const cols = ['#FFD24D', '#FFFFFF', '#FF8FA3', '#17B26A']
  const out = []
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + (i % 2 ? 0.18 : -0.12)
    const d = 170 + ((i * 37) % 110)
    out.push({
      bg: cols[i % 4],
      w: (i % 3 === 0 ? 18 : 12) + 'px',
      h: (i % 3 === 0 ? 10 : 12) + 'px',
      r: i % 2 ? '999px' : '3px',
      dx: Math.round(Math.cos(a) * d),
      dy: Math.round(Math.sin(a) * d * 0.8 - 30),
      rot: (i % 2 ? 1 : -1) * (120 + i * 23),
    })
  }
  return out
}

tpl = tpl.replace(
  /<sc-for list="\{\{ confetti \}\}"[^>]*>([\s\S]*?)<\/sc-for>/,
  (_, inner) =>
    confettis()
      .map((c) => inner.replace(/\{\{ c\.(\w+) \}\}/g, (__, key) => String(c[key])))
      .join('')
      .trim(),
)

// ------------------------------------------------------------ les conditions
// `display:contents` : le bloc n'existe que pour le script, il ne s'interpose
// pas dans la mise en page du parent. L'etat de depart est celui que la
// maquette annonce elle-meme (`hint-placeholder-val`), pour que la page
// servie soit deja juste — sans script, c'est le formulaire qu'on voit.
tpl = tpl
  .replace(/<sc-if value="\{\{ (\w+) \}\}"\s+hint-placeholder-val="\{\{ (true|false) \}\}"[^>]*>/g,
    (_, name, val) =>
      `<div data-if="${name}" style="display:${val === 'true' ? 'contents' : 'none'}">`)
  .replace(/<\/sc-if>/g, '</div>')

// Le message sous le formulaire sert aussi a dire qu'un envoi a echoue :
// on lui donne un nom pour pouvoir l'adresser. Rien ne change a l'ecran.
tpl = tpl.replace(
  '<div style="font-size:14px; font-weight:700; color:#131A33; margin-top:12px">Un seul message',
  '<div data-k="formNote" style="font-size:14px; font-weight:700; color:#131A33; margin-top:12px">Un seul message')

// ------------------------------------------------------------- les ecouteurs
tpl = tpl.replace(/\son([A-Z]\w+)="\{\{ (\w+) \}\}"/g,
  (_, evt, name) => ` data-on-${evt.toLowerCase()}="${name}"`)

// --------------------------------------------- les etats au survol, en CSS
// Un attribut par etat devient une classe et une regle. Les declarations
// elles-memes ne sont pas touchees.
const rules = []
let seq = 0
tpl = tpl.replace(/<([a-z]+)((?:\s+[^<>]*?)?)>/g, (tag, name, attrs) => {
  if (!/style-(hover|focus|active)=/.test(attrs)) return tag
  const cls = `dc${++seq}`
  let rest = attrs.replace(/\sstyle-(hover|focus|active)="([^"]*)"/g, (__, state, decls) => {
    rules.push(`.${cls}:${state}{${decls.replace(/;\s*$/, '')}}`)
    return ''
  })
  rest = /\sclass="/.test(rest)
    ? rest.replace(/\sclass="([^"]*)"/, ` class="$1 ${cls}"`)
    : `${rest} class="${cls}"`
  return `<${name}${rest}>`
})

// ------------------------------------------------------------- les ressources
tpl = tpl
  .replace(/src="gribou3d\/Gribou_transparent\.png"/g, 'src="/img/gribou-secours.png"')
  .replace(/src="shots\/canevas-ipad\.png"/g, 'src="/img/canevas-ipad.png"')
  .replace(/src="shots\/mac-markdown\.png"/g, 'src="/img/mac-markdown.png"')
  .replace(/src="site\/kurso-film\.mp4"/g, 'src="/video/kurso-film.mp4"')
  .replace(/poster="shots\/film4-poster\.jpg"/g, 'poster="/img/film-poster.jpg"')
  // L'image de secours n'est montree que si WebGL echoue : tant qu'on lui
  // laisse un `src`, le navigateur la telecharge quand meme — 140 Ko pour
  // rien a chaque visite. C'est le script qui la posera, le cas echeant.
  .replace(/(<img data-k="gfb" )src="\/img\/gribou-secours\.png"/, '$1data-src="/img/gribou-secours.png"')
  // La maquette liait une bande verticale qui n'a pas ete livree avec elle :
  // le lien sert le film, jusqu'a ce qu'on en depose une.
  .replace(/href="uploads\/kurso-motion\/Kurso_teaser_9x16\.mp4" download="[^"]*"/g,
           'href="/video/kurso-film.mp4" download="Kurso-film.mp4"')

// Le lien du logo portait un `aria-label` qui ne reprenait pas exactement
// son texte visible : un lecteur d'ecran annoncait autre chose que ce qui
// est ecrit, et la commande vocale ne trouvait plus le lien. Le texte
// « Kurso » suffit, et la pastille « K » est decorative.
tpl = tpl
  .replace(' aria-label="Kurso, haut de page"', '')
  .replace(
    /(<a href="#top"[^>]*>\s*<span) (style="width:34px)/,
    '$1 aria-hidden="true" $2')

// Les deux liens du pied de page pointaient sur des ancres de maquette.
tpl = tpl
  .replace('<a href="#top" style="color:#131A33; text-decoration:underline"',
           '<a href="/confidentialite" style="color:#131A33; text-decoration:underline"')
  .replace('<a href="#beta" style="color:#131A33; text-decoration:underline"',
           '<a href="mailto:contact@kurso.app" style="color:#131A33; text-decoration:underline"')

// ------------------------------------------------------------------ la tete
const CSS = `html.lenis,html.lenis body{height:auto}
.lenis.lenis-smooth{scroll-behavior:auto !important}
.lenis.lenis-stopped{overflow:hidden}
body{margin:0;background:#131A33;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
a{color:#3B5BFF;text-decoration:none}
a:hover{color:#131A33}
::selection{background:#FFD24D;color:#131A33}
${rules.join('\n')}`

const FONTS = [
  ['Baloo 2', 700, 'baloo2-700'], ['Baloo 2', 800, 'baloo2-800'],
  ['Nunito', 600, 'nunito-600'], ['Nunito', 700, 'nunito-700'], ['Nunito', 800, 'nunito-800'],
  ['Caveat', 700, 'caveat-700'], ['IBM Plex Mono', 600, 'plexmono-600'],
]
const FACES = FONTS.map(([fam, w, file]) =>
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:swap;` +
  `src:url(/fonts/${file}.woff2) format('woff2')}`).join('\n')

const TITLE = 'Kurso — le cahier qui te fait réviser'
const DESC = "Tu écris tes cours au Pencil, Kurso les range et te les fait réviser. " +
  "Chaque page est datée, classée dans la bonne matière, et devient des cartes de révision. " +
  "Bêta à la rentrée, sur iPad et Mac."

const head = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<meta name="theme-color" content="#131A33">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://kurso.app/">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:url" content="https://kurso.app/">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:image" content="https://kurso.app/img/partage.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/fonts/baloo2-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/nunito-700.woff2" as="font" type="font/woff2" crossorigin>
<style>${FACES}
${CSS}</style>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kurso',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'iPadOS, macOS',
  description: DESC,
  url: 'https://kurso.app/',
  offers: { '@type': 'Offer', price: '19.99', priceCurrency: 'EUR' },
})}</script>
</head>
<body>
`

const tail = `<script type="module" src="/src/page.js"></script>
</body>
</html>
`

// ------------------------------------------- la page de confidentialite
// Elle n'a rien d'interactif : pas une ligne de JavaScript. Une page qui
// explique qu'on ne piste personne ne devrait pas avoir besoin d'executer
// du code pour le dire.
const legal = readFileSync(join(root, 'maquette/confidentialite.html'), 'utf8')
const legalHead = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confidentialité — Kurso</title>
<meta name="description" content="Ce que Kurso enregistre quand tu rejoins la liste d'attente : une adresse, une origine de clic, une date. Aucun cookie, aucun traceur.">
<meta name="theme-color" content="#F6F8FF">
<meta name="robots" content="index, follow">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://kurso.app/confidentialite">
<link rel="preload" href="/fonts/baloo2-800.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/nunito-700.woff2" as="font" type="font/woff2" crossorigin>
<style>${FACES}
body{margin:0;background:#F6F8FF;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
a{text-decoration:none}
::selection{background:#FFD24D;color:#131A33}</style>
</head>
<body>
`
mkdirSync(join(root, 'public/confidentialite'), { recursive: true })
writeFileSync(join(root, 'public/confidentialite/index.html'), legalHead + legal + '</body>\n</html>\n')
console.log('  /confidentialite ecrite, sans JavaScript')

mkdirSync(join(root, 'src'), { recursive: true })
writeFileSync(join(root, 'index.html'), head + tpl.trim() + '\n' + tail)
console.log(`  index.html ecrit — ${rules.length} regles d'etat, ${Math.round((head.length + tpl.length) / 1024)} Ko`)
writeFileSync(join(root, 'src/logic.js'),
  '// REPRIS TEL QUEL de la maquette (maquette/site-v3.dc.html).\n' +
  '// Ne pas modifier ici : editer la maquette et relancer `npm run page`.\n' +
  '/* eslint-disable */\n' +
  'export default (DCLogic) => {\n' + logic + '\nreturn Component\n}\n')
console.log(`  src/logic.js ecrit — ${Math.round(logic.length / 1024)} Ko, repris tel quel`)
