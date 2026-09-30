import { useEffect, useRef, useState } from 'react'

/** Les actes du film, releves sur la bande. `at` est la position dans le
 *  film, de 0 a 1 : elle sert a la fois au titre qui s'affiche pendant le
 *  defilement et aux raccourcis de la version sonore. */
const ACTS = [
  { at: 0, t: 0, name: 'Le cahier' },
  { at: 0.22, t: 13.2, name: 'Écris' },
  { at: 0.355, t: 21.3, name: 'Entoure' },
  { at: 0.455, t: 27.3, name: 'Reviens' },
  { at: 0.655, t: 39.3, name: 'Ensemble' },
  { at: 0.855, t: 51.3, name: 'Le partiel' },
]

const FRAMES = 80
/** On n'entre pas sur la toute premiere image : le film ouvre sur un ecran
 *  presque noir, et un cadre vide pendant les cent premiers pixels de
 *  defilement se lit comme une panne, pas comme une intention. */
const FIRST = 4
const src = (i: number) => `/film/${String(i).padStart(3, '0')}.webp`
const time = (t: number) => `0:${String(Math.floor(t)).padStart(2, '0')}`

/**
 * Le film, deroule par le defilement.
 *
 * Quatre-vingts images fixes plutot que la video : on ne peut pas demander a
 * un mp4 de sauter a une image precise soixante fois par seconde — il se
 * decode par groupes, et le resultat saccade. Des images, elles, se
 * remplacent sans rien decoder. Quatre-vingts pour soixante secondes, seize
 * kilo-octets chacune : un mega et demi pour tout le film, et chaque cran de
 * molette avance vraiment d'une image.
 *
 * La version sonore reste a un clic : c'est le meme film, en entier.
 */
export default function FilmScrub() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [act, setAct] = useState(ACTS[0]!.name)
  const [ready, setReady] = useState(false)
  const [sound, setSound] = useState(false)

  useEffect(() => {
    const box = section.current
    const cv = canvas.current
    if (!box || !cv) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Sur un telephone on ne telecharge pas un mega et demi d'images pour un
    // effet : l'affiche et le bouton suffisent.
    if (window.innerWidth < 900) return

    const context = cv.getContext('2d', { alpha: false })
    if (!context) return

    const images: HTMLImageElement[] = []
    let loaded = 0
    for (let i = 0; i < FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = src(i)
      img.onload = () => {
        loaded++
        if (i === FIRST || loaded === 12) { setReady(true); draw(current) }
      }
      images[i] = img
    }

    let current = FIRST
    let frame = 0

    const fit = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.round(cv.clientWidth * scale)
      cv.height = Math.round(cv.clientHeight * scale)
      draw(current)
    }

    /** Dessine en « cover » : l'image remplit le cadre sans se deformer. */
    const draw = (index: number) => {
      let img = images[index]
      if (!img?.complete || !img.naturalWidth) {
        // Pas encore la : on garde la derniere image connue plutot que de
        // laisser un trou noir.
        for (let k = index; k >= 0; k--) {
          const candidate = images[k]
          if (candidate?.complete && candidate.naturalWidth) { img = candidate; break }
        }
      }
      if (!img?.complete || !img.naturalWidth) return
      const cw = cv.width, ch = cv.height
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * s, h = img.naturalHeight * s
      context.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const tick = () => {
      frame = 0
      const rect = box.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const p = travel > 0 ? Math.max(0, Math.min(1, -rect.top / travel)) : 0
      const index = Math.min(FRAMES - 1, FIRST + Math.round(p * (FRAMES - 1 - FIRST)))
      // Ces deux-la s'ecrivent directement dans le DOM : les passer par
      // l'etat de React redessinerait la page soixante fois par seconde
      // pour deux nombres.
      stage.current?.style.setProperty('--sp', p.toFixed(4))
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(4)})`
      const now = [...ACTS].reverse().find((a) => p >= a.at) ?? ACTS[0]!
      setAct((was) => (was === now.name ? was : now.name))
      if (index !== current) { current = index; draw(index) }
    }
    const ask = () => { if (!frame) frame = requestAnimationFrame(tick) }

    fit()
    tick()
    window.addEventListener('scroll', ask, { passive: true })
    window.addEventListener('resize', fit)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', ask)
      window.removeEventListener('resize', fit)
      images.forEach((img) => { img.onload = null })
    }
  }, [])

  function listen(at = 0) {
    setSound(true)
    const el = video.current
    if (!el) return
    if (at) el.currentTime = at
    void el.play()
  }

  return (
    <section
      ref={section}
      className="act scrub"
      id="film"
      data-bg="ink"
      data-n="01"
      data-name="LE FILM"
    >
      <div className="stage" ref={stage}>
        <div className="stage-frame">
          <canvas
            ref={canvas}
            className={`stage-canvas${ready ? ' is-ready' : ''}`}
            role="img"
            aria-label="Le film de Kurso : une rentrée, un semestre, un partiel."
          />
          {/* L'affiche est la premiere image de la suite : tant que rien
              n'est charge, et sur telephone ou l'on ne charge rien, le cadre
              montre deja le bon plan. */}
          <img className="stage-poster" src="/film/004.webp" alt="" width={900} height={506} />
          <video
            ref={video}
            className={`stage-video${sound ? ' is-live' : ''}`}
            src="/video/film.mp4"
            poster="/img/film-poster.jpg"
            preload="none"
            playsInline
            controls={sound}
            onEnded={() => setSound(false)}
            width={1280}
            height={720}
          />
        </div>

        <div className="stage-hud">
          {/* Le titre et le nom de l'acte occupent la MEME place : le titre
              s'efface des les premiers pour cent, l'acte prend le relais.
              Pose ailleurs, le titre masquerait le film. */}
          <div className="stage-title">
            <div className="stage-copy">
              <p className="label">CHAPITRE 01 · SOIXANTE SECONDES</p>
              <h2>Déroule, le film avance.</h2>
            </div>
            <p className="stage-act">
              <span className="stage-n">01</span>
              <span className="stage-name">{act}</span>
            </p>
          </div>
          <div className="stage-bar" aria-hidden="true"><span ref={bar} /></div>
          <ol className="acts" aria-label="Chapitres du film">
            {ACTS.map((a) => (
              <li key={a.t}>
                <button type="button" onClick={() => listen(a.t)}>
                  <span className="acts-time">{time(a.t)}</span>
                  {a.name}
                </button>
              </li>
            ))}
          </ol>
          <button className="stage-sound" type="button" data-magnet onClick={() => listen()}>
            Écouter le film
          </button>
        </div>
      </div>
    </section>
  )
}
