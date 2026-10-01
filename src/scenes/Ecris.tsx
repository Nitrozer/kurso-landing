import { Words } from '../components/Marks'

/** Une seance : colonne (0 = lundi), heure de debut, duree, matiere.
 *  Les horaires viennent du film — c'est la meme semaine. */
const SEANCES: [number, number, number, string, string][] = [
  [0, 8, 2, 'Analyse', 'vert'],
  [0, 10, 2, 'Algo', 'bleu'],
  [0, 14, 2, 'Stats', 'jaune'],
  [1, 8, 2, 'Analyse', 'vert'],
  [1, 10, 2, 'Algo', 'bleu'],
  [1, 14, 3, 'Physique', 'rose'],
  [2, 9, 2, 'Stats', 'jaune'],
  [3, 8, 2, 'Algo', 'bleu'],
  [3, 13, 2, 'Physique', 'rose'],
  [4, 8, 3, 'Analyse', 'vert'],
  [4, 14, 2, 'Physique', 'rose'],
]

const CAHIERS = [
  { nom: 'Algorithmique', ton: 'bleu', n: '6 séances' },
  { nom: 'Analyse III', ton: 'vert', n: '5 séances' },
  { nom: 'Physique quantique', ton: 'rose', n: '5 séances' },
  { nom: 'Statistiques', ton: 'jaune', n: '4 séances' },
]

const JOURS = ['LUN', 'MAR', 'MER', 'JEU', 'VEN']
const DEBUT = 8
const HEURES = 11

/** D'ou chaque seance arrive : eparpillees autour de la grille, jamais deux
 *  au meme endroit. Tire d'une suite fixe — un hasard recalcule a chaque
 *  rendu ferait sauter la scene entre le serveur et le navigateur. */
function depart(i: number) {
  const angle = (i * 137.5 * Math.PI) / 180
  return {
    fx: Math.round(Math.cos(angle) * 460),
    fy: Math.round(Math.sin(angle) * 320),
    rot: Math.round(Math.cos(angle * 2) * 22),
  }
}

/**
 * La scene « Écris » : l'emploi du temps se range tout seul.
 *
 * C'est la promesse la plus difficile a croire sur une page — « tu n'as
 * rien a classer » — donc c'est celle qu'on montre au lieu de l'ecrire.
 * Les seances arrivent de partout et se posent dans la grille, puis les
 * cahiers s'empilent. Tout est pilote par `--q`, l'avancee dans la scene :
 * on peut remonter, la scene se rejoue a l'envers.
 */
export default function Ecris() {
  return (
    <section className="act scene-act" data-scene data-bg="blue" data-n="02" data-name="ÉCRIS">
      <div className="scene">
        <div className="gut scene-grid">
          <div className="scene-copy">
            <p className="label" data-rise>LE PREMIER GESTE</p>
            <h2><Words text="Écris." /><br /><Words text="Rien à classer." d={120} /></h2>
            <p className="lede" data-rise style={{ '--d': '320ms' } as React.CSSProperties}>
              Comme sur du papier. Ton emploi du temps range les pages pour toi :
              la page ouverte à 8 h 15 le mardi est une page d'automatique, datée,
              dans le bon cahier, sans que tu aies rien nommé.
            </p>
            <p className="scene-count">
              <b>11 séances</b> rangées en <b>4 cahiers</b>. Zéro dossier.
            </p>
          </div>

          <div className="scene-art">
            <div className="semaine">
              <p className="semaine-head">
                <span>SEMAINE 38 · 14 — 18 SEPT.</span>
                <span className="semaine-ics">edt.ma-fac.fr/cours.ics</span>
              </p>
              <div className="semaine-days">
                {JOURS.map((j) => <span key={j}>{j}</span>)}
              </div>
              <div className="semaine-body">
                {JOURS.map((j, c) => (
                  <span className="semaine-col" key={j} style={{ left: `${c * 20}%` }} />
                ))}
                {SEANCES.map(([col, debut, duree, nom, ton], i) => {
                  const d = depart(i)
                  return (
                    <span
                      key={`${nom}-${i}`}
                      className={`seance t-${ton}`}
                      style={{
                        '--x': `${col * 20 + 1.2}%`,
                        '--y': `${((debut - DEBUT) / HEURES) * 100}%`,
                        '--w': '17.6%',
                        '--h': `${(duree / HEURES) * 100 - 1.6}%`,
                        '--fx': `${d.fx}px`,
                        '--fy': `${d.fy}px`,
                        '--rot': `${d.rot}deg`,
                        '--d': `${(i * 0.035).toFixed(3)}`,
                      } as React.CSSProperties}
                    >
                      {nom}
                    </span>
                  )
                })}
              </div>
            </div>

            <ul className="cahiers">
              {CAHIERS.map((c, i) => (
                <li
                  key={c.nom}
                  className={`cahier t-${c.ton}`}
                  style={{ '--d': `${(i * 0.055).toFixed(3)}` } as React.CSSProperties}
                >
                  <b>{c.nom}</b>
                  <span>{c.n} · cahier créé</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
