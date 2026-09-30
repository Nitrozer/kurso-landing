import { useRef, useState } from 'react'

/** Les actes du film. Les temps sont releves sur la bande elle-meme, pas
 *  inventes : un chapitre qui tombe au milieu d'un fondu se voit. */
const ACTS = [
  { t: 0, name: 'Le cahier' },
  { t: 13.2, name: 'Écris' },
  { t: 21.3, name: 'Entoure' },
  { t: 27.3, name: 'Reviens' },
  { t: 39.3, name: 'Ensemble' },
  { t: 51.3, name: 'Le partiel' },
]

const time = (t: number) => `0:${String(Math.floor(t)).padStart(2, '0')}`

/**
 * Le film, en entier, avec le son.
 *
 * Rien n'est telecharge avant le clic (`preload="none"`) : neuf megaoctets
 * ne partent pas parce qu'on passe devant. L'affiche, elle, est la des le
 * depart — un cadre noir au milieu d'une page n'invite personne.
 */
export default function Film() {
  const video = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function play(at = 0) {
    const el = video.current
    if (!el) return
    setStarted(true)
    if (at) el.currentTime = at
    void el.play()
  }

  return (
    <div className="film">
      <div className={`cinema${started ? ' is-live' : ''}`} data-rise>
        <video
          ref={video}
          className="cinema-video"
          src="/video/film.mp4"
          poster="/img/film-poster.jpg"
          preload="none"
          playsInline
          controls={started}
          onEnded={() => setStarted(false)}
          width={1280}
          height={720}
        />
        {!started && (
          <button className="cinema-play" type="button" onClick={() => play()}>
            <span className="cinema-triangle" aria-hidden="true" />
            <span className="cinema-play-text">
              Voir le film
              <small>60 secondes · avec le son</small>
            </span>
          </button>
        )}
      </div>

      <ol className="acts" aria-label="Chapitres du film">
        {ACTS.map((act) => (
          <li key={act.t}>
            <button type="button" onClick={() => play(act.t)}>
              <span className="acts-time">{time(act.t)}</span>
              {act.name}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
