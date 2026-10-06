// Le socle qui remplace le harnais de l'editeur de maquette.
//
// La maquette tourne dans un éditeur qui lui fournit trois choses : une
// classe de base, un petit langage de gabarit (`<sc-if>`, `{{ … }}`), et
// React. Le site n'a besoin d'aucun des trois. Le gabarit a été figé au
// build (voir `tools/build-page.mjs`), et il ne reste ici qu'à :
//
//   — donner au composant sa classe de base et ses réglages,
//   — brancher les quelques écouteurs que le gabarit déclarait,
//   — montrer ou cacher les deux blocs conditionnels,
//   — et envoyer vraiment l'adresse e-mail, ce que la maquette ne faisait pas.
//
// Le fichier `logic.js` est repris tel quel de la maquette : c'est lui qui
// fait tout le mouvement. On ne le touche pas.
import Lenis from 'lenis'
import makeComponent from './logic.js'
import { joinWaitlist } from './lib/waitlist'

// La maquette va chercher `window.Lenis` : on le lui pose, empaqueté plutôt
// que chargé depuis un CDN.
window.Lenis = Lenis

class DCLogic {
  constructor(props) {
    this.props = props
  }
  setState(patch) {
    Object.assign(this.state, patch)
    this.$apply()
  }
  $apply() {}
}

// Les réglages de la maquette, repris de ses `data-props`.
const app = new (makeComponent(DCLogic))({ intro: true, smooth: 0.1, parallax: 1 })

let vals = {}
app.$apply = () => {
  vals = app.renderVals()
  for (const el of document.querySelectorAll('[data-if]')) {
    el.style.display = vals[el.dataset.if] ? 'contents' : 'none'
  }
}

// Utile aux captures de verification : on peut piloter la scene depuis la
// console. Aucune incidence sur la page.
if (import.meta.env?.DEV) window.__kurso = app

app.componentDidMount()
app.$apply()

// --------------------------------------------------------- les écouteurs
for (const type of ['click', 'input']) {
  for (const el of document.querySelectorAll(`[data-on-${type}]`)) {
    const name = el.getAttribute(`data-on-${type}`)
    el.addEventListener(type, (e) => vals[name]?.(e))
  }
}

// --------------------------------------------------- l'image de secours
// Elle ne porte pas de `src` : sans cela le navigateur la telechargerait a
// chaque visite alors qu'elle ne sert qu'en cas d'echec de WebGL. Le script
// de la maquette la rend visible ; on attend ce moment pour la charger.
const secours = document.querySelector('img[data-k="gfb"]')
if (secours?.dataset.src) {
  new MutationObserver((_, obs) => {
    if (secours.style.display !== 'none') {
      secours.src = secours.dataset.src
      obs.disconnect()
    }
  }).observe(secours, { attributes: true, attributeFilter: ['style'] })
}

// --------------------------------------------------------- la liste d'attente
// La maquette se contentait d'afficher « C'est noté. ». Ici l'adresse part
// vraiment, et on n'affiche la confirmation qu'une fois qu'elle est passée :
// annoncer une inscription qui a échoué serait un mensonge à l'écran.
const form = document.querySelector('[data-on-submit]')
form?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const field = app.k?.emailField
  const note = app.k?.formNote
  const email = (field?.value || '').trim()

  if (email.indexOf('@') < 1) {
    if (field) field.style.borderColor = '#B3242A'
    return
  }
  if (field) field.style.borderColor = '#131A33'

  const button = form.querySelector('button')
  const label = button?.textContent
  if (button) { button.disabled = true; button.textContent = 'UN INSTANT…' }

  try {
    await joinWaitlist(email, 'hero')
    app.setState({ joined: true })
  } catch {
    if (field) field.style.borderColor = '#B3242A'
    if (note) { note.textContent = "Ça n'est pas passé. Réessaie dans un instant."; note.style.color = '#B3242A' }
    if (button) { button.disabled = false; button.textContent = label }
  }
})
