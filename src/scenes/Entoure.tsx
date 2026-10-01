import { Words } from '../components/Marks'

/**
 * La scene « Entoure » : une ligne du cours devient une carte.
 *
 * Le geste central de l'app, joue en entier : la ligne s'ecrit, le feutre
 * en fait le tour, le morceau de page se detache, se retourne — et c'est
 * une carte, qui se pose sur la pile. Six temps dans une seule scene, tous
 * decoupes dans `--q`.
 *
 * Le retournement est une vraie rotation dans l'espace : recto la page,
 * verso la carte, dos a dos. C'est ce qui fait qu'on croit que l'une
 * DEVIENT l'autre, au lieu de voir deux objets se remplacer.
 */
export default function Entoure() {
  return (
    <section className="act scene-act" data-scene data-bg="yellow" data-n="03" data-name="ENTOURE">
      <div className="scene">
        <div className="gut scene-grid scene-grid-rev">
          <div className="scene-copy">
            <p className="label" data-rise>LE DEUXIÈME GESTE</p>
            <h2><Words text="Entoure" /><br /><Words text="un passage." d={160} /></h2>
            <p className="lede" data-rise style={{ '--d': '340ms' } as React.CSSProperties}>
              Il devient une carte de révision — avec ton écriture, telle quelle.
              Une échéance écrite à la main devient une tâche. Rien n'est généré :
              Kurso lit ce que tu as écrit, et te le rend au bon moment.
            </p>
            <ol className="temps" aria-hidden="true">
              <li className="t1">Tu écris</li>
              <li className="t2">Tu entoures</li>
              <li className="t3">Ça se détache</li>
              <li className="t4">C'est une carte</li>
            </ol>
          </div>

          <div className="scene-art">
            <div className="naissance">
              {/* La page du cours, avec ses lignes. */}
              <div className="page">
                <p className="page-head">
                  <span className="page-tag">ALGORITHMIQUE</span>
                  <span>TRI PAR TAS · PAGE 3</span>
                </p>
                <span className="page-rule r1" />
                <span className="page-rule r2" />
                <span className="page-rule r3" />
                <span className="page-rule r4" />
                <span className="page-before">Tas binaire</span>
                <span className="page-after">on remonte tant que parent &gt; enfant</span>
              </div>

              {/* Le morceau qui se detache, se retourne, et la pile qui
                  l'accueille — posee DANS le morceau, pour qu'elle soit
                  toujours exactement derriere lui, ou qu'il atterrisse. */}
              <div className="morceau">
                <span className="pile-c c2" aria-hidden="true" />
                <span className="pile-c c1" aria-hidden="true" />
                <span className="pile-n" aria-hidden="true">3 cartes</span>
                <div className="morceau-flip">
                  <div className="face recto">
                    <span className="recto-mot">insertion en O(log n)</span>
                    <svg className="recto-loop" viewBox="0 0 120 44" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M6 24 C 7 9, 30 4, 60 4 C 92 4, 114 10, 114 23 C 114 35, 88 40, 58 40 C 28 40, 5 35, 5 22 C 5 13, 15 8, 27 6" />
                    </svg>
                  </div>
                  <div className="face verso">
                    <p className="chip">RECTO / VERSO<span>CAPTURÉE LE 15.09</span></p>
                    <p className="verso-q">Coût d'une insertion<br />dans un tas binaire ?</p>
                    <p className="verso-foot"><b>+2 XP à chaud</b><span>TON ÉCRITURE</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
