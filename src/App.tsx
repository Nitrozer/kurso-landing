import WaitlistForm from './components/WaitlistForm'
import Film from './components/Film'
import Ecris from './scenes/Ecris'
import Entoure from './scenes/Entoure'
import { Arrow, Img, Marker, Words } from './components/Marks'
import {
  useChapter, useCursor, useCurtain, useMagnets, useMotion, useReveal, useScenes, useStage,
} from './lib/motion'

const PROMISES = [
  { title: 'Tes cours restent chez toi', desc: "Ils vivent dans ton iCloud. Aucune de tes notes n'est hébergée sur nos serveurs.", bg: '#17B26A' },
  { title: 'Un achat, pas un abonnement', desc: 'Les cahiers, les cartes et le jeu sont gratuits. 19,99 € une fois pour le reste.', bg: '#FFD24D' },
  { title: 'iPad et Mac', desc: 'Le Pencil en amphi, le clavier à la maison. La même page, des deux côtés.', bg: '#3B5BFF' },
  { title: 'Deux notifications par jour, maximum', desc: "Et rien le week-end si tu n'as rien à rendre.", bg: '#FF8FA3' },
]

const FAQ = [
  { q: 'Comment Kurso connaît mon emploi du temps ?', a: "Tu colles une fois le lien de ta fac — ADE, Hyperplanning, Celcat, Moodle en donnent tous un. Ensuite il se met à jour seul, y compris les changements de salle. Sinon : le calendrier de ton appareil, ou une photo de la grille papier." },
  { q: "Est-ce que c'est une IA qui écrit mes cours ?", a: "Non, et c'est un choix. Kurso ne rédige rien, ne résume rien, ne génère pas soixante cartes depuis un PDF. Il lit une grille d'emploi du temps, repère une échéance dans une phrase, et propose trois cartes en fin de cours — que tu gardes ou que tu jettes. Le reste, c'est ton travail, et c'est justement ce qui te fait retenir." },
  { q: 'Et si mes cours sont des diapos ?', a: "Tu déposes le PDF, il rejoint la bonne matière et s'ouvre à la diapo que le prof affiche. Tu surlignes, tu annotes, tu masques une ligne pour en faire une question. Le prof donne le cours, toi tu donnes le piège." },
  { q: 'Faut-il créer un compte ?', a: "Tu te connectes une fois, avec Apple, Google ou une adresse e-mail — c'est ce qui te retrouve d'un appareil à l'autre. Mais tes cours, eux, ne passent pas par là : ils restent dans ton iCloud, et nous n'y avons pas accès." },
  { q: "Je vais perdre mes notes si je change d'appareil ?", a: "Non : tout est synchronisé par ton iCloud, hors-ligne compris. Et si tu écris sur la même page depuis deux appareils sans réseau, Kurso te montre les deux versions au lieu d'en effacer une." },
  { q: "C'est encore une app qui va me culpabiliser ?", a: "C'est l'inverse du projet. La série se gèle pendant les partiels, les cartes ratées reviennent sans punition, et la relance principale n'est pas une notification : c'est ton écriture qui pâlit doucement dans la page." },
]

/** La ligue de la semaine. `de` est la place occupee AVANT la revision du
 *  soir : la scene fait remonter « Toi » de la cinquieme a la troisieme,
 *  et redescendre ceux qu'il double. Le classement final est celui-ci. */
const LIGUE = [
  { r: 1, de: 1, n: 'Inès B.', xp: '1 480' },
  { r: 2, de: 2, n: 'Camille R.', xp: '1 310' },
  { r: 3, de: 5, n: 'Toi', xp: '1 270', moi: true },
  { r: 4, de: 3, n: 'Maxime D.', xp: '1 240' },
  { r: 5, de: 4, n: 'Sarah K.', xp: '1 095' },
]

const ms = (n: number) => ({ '--d': `${n}ms` } as React.CSSProperties)

export default function App() {
  useMotion()
  useReveal()
  useStage()
  useScenes()
  useCursor()
  useMagnets()
  const curtain = useCurtain()
  const chapter = useChapter()

  return (
    <>
      {/* Le rideau : il n'existe que si le script tourne, et la page est
          deja peinte dessous. */}
      {curtain && (
        <div className="curtain-sheet" aria-hidden="true">
          <span className="curtain-mark">K</span>
        </div>
      )}

      {/* Le grain : deux pour cent de bruit, pour que les aplats ne soient
          pas parfaitement lisses. */}
      <div className="grain" aria-hidden="true" />

      <header className="bar">
        <a className="logo" href="#haut">
          <span className="logo-mark" aria-hidden="true">K</span>
          <span className="logo-word">Kurso</span>
        </a>
        <p className="pill"><span className="dot" aria-hidden="true" />Bêta à la rentrée · iPad et Mac</p>
      </header>

      {/* Le compteur de bobine : on sait toujours dans quel acte on est. */}
      <aside className="rail" aria-hidden="true">
        <span className="rail-n">{chapter?.n ?? '00'}</span>
        <span className="rail-name">{chapter?.name ?? 'LE CAHIER'}</span>
      </aside>

      <main>
        {/* ---- 00 · l'ouverture ------------------------------------ */}
        <section className="act open" id="haut" data-bg="ink" data-n="00" data-name="LE CAHIER" data-par>
          <div className="gut open-grid">
            <div className="open-copy">
              <p className="label" data-rise>PRISE DE NOTES · RÉVISION · IPAD ET MAC</p>
              <h1>
                <span className="line"><Words text="Le cahier" /></span>
                <span className="line"><Words text="qui te fait" d={160} /></span>
                <span className="line">
                  <span className="w" data-rise style={ms(340)}>
                    <span><Marker>réviser</Marker>.</span>
                  </span>
                </span>
              </h1>
              <p className="lede" data-rise style={ms(460)}>
                Tu écris tes cours au Pencil, comme sur du papier. Kurso s'occupe du reste :
                chaque page est datée, rangée dans la bonne matière, et devient des cartes
                de révision quand tu entoures un passage.
              </p>
              <div data-rise style={ms(560)}>
                <WaitlistForm source="hero" cta="ME PRÉVENIR"
                  note="Un seul message, le jour de la sortie. Rien d'autre." />
              </div>
            </div>

            {/* La boucle muette : sept secondes, la page qui s'écrit toute seule. */}
            <div className="open-screen" data-rise style={ms(260)}>
              <div className="screen">
                <video className="screen-video" src="/video/boucle.mp4" poster="/img/boucle-poster.jpg"
                  autoPlay muted loop playsInline preload="auto" width={960} height={540}
                  aria-label="Une page de cours qui s'écrit : une ligne manuscrite, puis une échéance qui devient une tâche." />
              </div>
              <Img name="gribou" alt="Gribou, la mascotte de Kurso" w={340} h={340}
                className="open-gribou bob" eager />
            </div>
          </div>

          <a className="scroll" href="#film">
            <span className="label">DÉROULE</span>
            <Arrow />
          </a>
        </section>

        {/* ---- 01 · la bande-annonce ------------------------------- */}
        <section className="act film-act" id="film" data-bg="ink" data-n="01" data-name="LE FILM">
          <div className="gut">
            <div className="act-head">
              <p className="label" data-rise>CHAPITRE 01 · SOIXANTE SECONDES</p>
              <h2><Words text="Une minute," /><br /><Words text="et tu as tout vu." d={180} /></h2>
            </div>
            <Film />
          </div>
        </section>

        {/* ---- 02 · écris : l'emploi du temps se range ------------- */}
        <Ecris />

        {/* ---- 03 · entoure : une ligne devient une carte ----------- */}
        <Entoure />

        {/* ---- 04 · reviens ---------------------------------------- */}
        <section className="act" data-bg="green" data-n="04" data-name="REVIENS">
          <div className="gut act-split">
            <div className="act-copy">
              <p className="label" data-rise>LE TROISIÈME GESTE</p>
              <h2><Words text="Reviens." /><br /><Words text="Dix minutes." d={120} /></h2>
              <p className="lede" data-rise style={ms(320)}>
                Le soir, pas trois heures. Tes pages redeviennent nettes, ton crayon
                se retaille, ta série tient. Les cartes ratées reviennent sans punition,
                et la série se gèle pendant les partiels.
              </p>
              <ul className="gommes" data-rise style={ms(420)}>
                <li aria-hidden="true" /><li aria-hidden="true" /><li aria-hidden="true" />
                <li aria-hidden="true" /><li aria-hidden="true" />
                <li className="gommes-note">5 gommes · aucune perdue</li>
              </ul>
            </div>
            <div className="act-art" data-par data-rise style={ms(180)}>
              <div className="frame tilt-rev">
                <Img name="shot-session" alt="Une session de révision : une carte, un combo, quelques gommes." w={560} h={420} />
              </div>
            </div>
          </div>
        </section>

        {/* ---- 05 · l'encre ---------------------------------------- */}
        <section className="act" data-bg="ink" data-n="05" data-name="L'ENCRE">
          <div className="gut act-split act-split-rev">
            <div className="act-copy">
              <p className="label" data-rise>LA JAUGE QU'ON NE PEUT PAS IGNORER</p>
              <h2><Words text="Tes notes pâlissent" /><br /><Words text="quand tu oublies." d={200} /></h2>
              <p className="lede" data-rise style={ms(400)}>
                Pas de notification culpabilisante : l'encre de tes propres pages
                s'éclaircit à l'écran à mesure que la mémoire se dégrade. Réviser les
                rend nettes à nouveau. C'est une jauge d'oubli qu'on ne peut pas
                ignorer, parce qu'elle est dans la page elle-même.
              </p>
            </div>
            <div className="act-art" data-par data-rise style={ms(180)}>
              <div className="fade-card">
                <p className="sr-only">
                  Illustration : trois lignes d'une même page, de la plus fraîche
                  à la presque effacée.
                </p>
                <div aria-hidden="true">
                  <span className="hand">insertion en O(log n)</span>
                  <span className="hand f2">hauteur = ⌊log₂ n⌋</span>
                  <span className="hand f3">amorti ≠ moyen</span>
                  <span className="label">FRAÎCHE · PÂLIT · PRESQUE EFFACÉE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- 06 · ensemble --------------------------------------- */}
        <section className="act" data-bg="pink" data-n="06" data-name="ENSEMBLE">
          <div className="gut">
            <div className="act-head">
              <p className="label" data-rise>ENTRE AMIS, PAS ENTRE INCONNUS</p>
              <h2><Words text="Une ligue entre amis." /><br /><Words text="Personne ne descend." d={220} /></h2>
              <p className="lede" data-rise style={ms(420)}>
                On s'ajoute avec un code donné de vive voix : pas d'annuaire, pas de
                recherche par prénom, personne ne peut te trouver. Douze places,
                remises à zéro chaque semaine — les trois premiers montent, et
                personne ne redescend.
              </p>
            </div>
            <div className="social" data-par>
              <article className="card code" data-rise>
                <p className="label">TON CODE</p>
                <p className="code-value">K7M-3QX</p>
                <p className="code-note">Donne-le de vive voix. Personne ne peut te chercher par ton prénom.</p>
              </article>
              {/* Le classement se remet en ordre sous les yeux : « Toi »
                  remonte de deux places, les autres se decalent. Une liste
                  deja triee ne dirait rien du soir ou on l'a gagnee. */}
              <article className="card ligue" data-par data-rise style={ms(120)}>
                <p className="label">LIGUE 2B · CETTE SEMAINE</p>
                <ol>
                  {LIGUE.map((l) => (
                    <li
                      key={l.r}
                      className={l.moi ? 'moi' : undefined}
                      style={{ '--saut': l.de - l.r } as React.CSSProperties}
                    >
                      {/* Les deux rangs, l'un sur l'autre : celui d'avant
                          s'efface pendant que la ligne monte. Afficher tout
                          de suite le rang final donnait une liste numerotee
                          1, 2, 4, 5, 3. */}
                      <span className="ligue-r">
                        <i>{l.de}</i><b>{l.r}</b>
                      </span>
                      <span className="ligue-n">{l.n}</span>
                      {l.r <= 3 && <span className="ligue-up">MONTE</span>}
                      <span className="ligue-xp">{l.xp} XP</span>
                    </li>
                  ))}
                </ol>
              </article>
            </div>
          </div>
        </section>

        {/* ---- 07 · les promesses ---------------------------------- */}
        <section className="act act-short" data-bg="paper" data-n="07" data-name="LES PROMESSES">
          <div className="gut">
            <h2 className="sr-only">Ce que Kurso te promet</h2>
            <div className="promises">
              {PROMISES.map((p, i) => (
                <article className="promise" key={p.title} data-rise style={ms(i * 90)}>
                  <p className="chip-square" style={{ background: p.bg }} aria-hidden="true" />
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- 08 · les questions ---------------------------------- */}
        <section className="act act-short" data-bg="paper" data-n="08" data-name="LES QUESTIONS">
          <div className="gut faq">
            <h2><Words text="Les questions" /><br /><Words text="qu'on me pose" d={140} /></h2>
            <div className="faq-list">
              {FAQ.map((f, i) => (
                <article className="faq-item" key={f.q} data-rise style={ms(i * 50)}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <section className="act act-short cta" data-bg="blue" data-n="09" data-name="LA BÊTA">
          <div className="gut cta-grid">
            <div>
              <p className="label" data-rise>TRENTE PLACES</p>
              <h2><Words text="Bêta à la rentrée." /><br /><Words text="Places limitées." d={180} /></h2>
              <p className="lede" data-rise style={ms(380)}>
                Je cherche une trentaine d'étudiants qui prennent leurs cours au Pencil
                et qui accepteront de me dire ce qui ne va pas.
              </p>
              <div data-rise style={ms(460)}>
                <WaitlistForm source="footer" cta="REJOINDRE LA BÊTA"
                  note="Un seul message, le jour de la sortie. Rien d'autre." />
              </div>
            </div>
            <div className="cta-art" data-par data-rise style={ms(260)}>
              <Img name="gribou-applaudit" alt="Gribou applaudit" w={260} h={260} className="bob" />
            </div>
          </div>
        </section>
        <div className="gut foot">
          <span>Kurso · fait par un étudiant, pour des étudiants</span>
          <nav>
            <a href="/confidentialite">Confidentialité</a>
            <a href="mailto:contact@kurso.app">Contact</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
