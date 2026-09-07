import WaitlistForm from './components/WaitlistForm'

/** Une image en trois formats : AVIF, WebP, puis PNG pour les navigateurs anciens.
 *  width/height sont toujours donnes — sans eux la page saute au chargement. */
function Img({ name, alt, w, h, className, eager }: {
  name: string; alt: string; w: number; h: number; className?: string; eager?: boolean
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={`/img/${name}.avif 1x, /img/${name}@2x.avif 2x`} />
      <source type="image/webp" srcSet={`/img/${name}.webp 1x, /img/${name}@2x.webp 2x`} />
      <img src={`/img/${name}.png`} alt={alt} width={w} height={h} className={className}
        loading={eager ? 'eager' : 'lazy'} decoding={eager ? 'sync' : 'async'}
        {...(eager ? { fetchPriority: 'high' as const } : {})} />
    </picture>
  )
}

const STEPS = [
  { n: '1', title: 'Écris', desc: "Comme sur du papier. Rien à classer, rien à nommer : ton emploi du temps range les pages pour toi.", bg: '#FFFFFF', fg: '#131A33' },
  { n: '2', title: 'Entoure', desc: "Un passage entouré devient une carte de révision. Une échéance écrite à la main devient une tâche.", bg: '#FFD24D', fg: '#131A33' },
  { n: '3', title: 'Reviens', desc: "Dix minutes le soir. Tes pages redeviennent nettes, ton crayon se retaille, ta série tient.", bg: '#17B26A', fg: '#FFFFFF' },
]

const SHOTS = [
  { name: 'shot-canevas', title: 'Le canevas', desc: "Ta page, ton écriture, et presque aucune interface autour." },
  { name: 'shot-memoire', title: 'La carte du semestre', desc: "Chaque page écrite devient un nœud. Elle se dessine derrière toi." },
  { name: 'shot-session', title: 'La session', desc: "Des gommes, un combo, quelques cartes. Dix minutes, pas trois heures." },
]

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
  { q: "Faut-il créer un compte ?", a: "Tu te connectes une fois, avec Apple, Google ou une adresse e-mail — c'est ce qui te retrouve d'un appareil à l'autre. Mais tes cours, eux, ne passent pas par là : ils restent dans ton iCloud, et nous n'y avons pas accès." },
  { q: "Je vais perdre mes notes si je change d'appareil ?", a: "Non : tout est synchronisé par ton iCloud, hors-ligne compris. Et si tu écris sur la même page depuis deux appareils sans réseau, Kurso te montre les deux versions au lieu d'en effacer une." },
  { q: "C'est encore une app qui va me culpabiliser ?", a: "C'est l'inverse du projet. La série se gèle pendant les partiels, les cartes ratées reviennent sans punition, et la relance principale n'est pas une notification : c'est ton écriture qui pâlit doucement dans la page." },
]

export default function App() {
  return (
    <>
      <header className="wrap nav">
        <div className="logo">
          <span className="logo-mark" aria-hidden="true">K</span>
          <span className="logo-word">Kurso</span>
        </div>
        <p className="pill"><span className="dot" aria-hidden="true" />Bêta à la rentrée · iPad et Mac</p>
      </header>

      <main>
        <section className="wrap hero">
          <div className="hero-copy">
            <h1>Le cahier qui te fait <span className="mark">réviser</span>.</h1>
            <p className="lede">
              Tu écris tes cours au Pencil, comme sur du papier. Kurso s'occupe du reste :
              chaque page est datée, rangée dans la bonne matière, et devient des cartes
              de révision quand tu entoures un passage.
            </p>
            <WaitlistForm source="hero" cta="ME PRÉVENIR"
              note="Un seul message, le jour de la sortie. Rien d'autre." />
          </div>
          <div className="hero-art">
            <Img name="gribou" alt="Gribou, la mascotte de Kurso" w={340} h={340} className="bob" eager />
          </div>
        </section>

        <section className="steps">
          <div className="wrap">
            <h2 className="mono-label">TROIS GESTES, PUIS PLUS RIEN À FAIRE</h2>
            <div className="grid">
              {STEPS.map(s => (
                <article className="step" key={s.n}>
                  <p className="step-n" style={{ background: s.bg, color: s.fg }}>{s.n}</p>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="wrap shots">
          <h2>Ce que ça donne</h2>
          <div className="grid">
            {SHOTS.map(s => (
              <article className="shot" key={s.name}>
                <div className="shot-frame">
                  <Img name={s.name} alt={s.title} w={560} h={420} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wrap">
          <div className="ink-band">
            <div style={{ flex: '1 1 380px', minWidth: 280 }}>
              <h2>Tes notes pâlissent quand tu oublies.</h2>
              <p>
                Pas de notification culpabilisante : l'encre de tes propres pages s'éclaircit
                à l'écran à mesure que la mémoire se dégrade. Réviser les rend nettes à nouveau.
                C'est une jauge d'oubli qu'on ne peut pas ignorer, parce qu'elle est dans la
                page elle-même.
              </p>
            </div>
            <div className="fade-card">
              <p className="sr-only">
                Illustration : trois lignes d'une même page, de la plus fraîche
                à la presque effacée.
              </p>
              <div aria-hidden="true">
                <span>insertion en O(log n)</span>
                <span className="f2">hauteur = ⌊log₂ n⌋</span>
                <span className="f3">amorti ≠ moyen</span>
                <span className="mono-label">FRAÎCHE · PÂLIT · PRESQUE EFFACÉE</span>
              </div>
            </div>
          </div>
        </section>

        <section className="wrap promises">
          <h2 className="sr-only">Ce que Kurso te promet</h2>
          {PROMISES.map(p => (
            <article className="promise card" key={p.title}>
              <p className="chip" style={{ background: p.bg }} aria-hidden="true" />
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </section>

        <section className="wrap faq">
          <h2>Les questions qu'on me pose</h2>
          <div className="faq-list">
            {FAQ.map(f => (
              <article className="faq-item" key={f.q}>
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <section className="wrap cta">
          <div className="cta-copy">
            <h2>Bêta à la rentrée. Places limitées.</h2>
            <p>
              Je cherche une trentaine d'étudiants qui prennent leurs cours au Pencil
              et qui accepteront de me dire ce qui ne va pas.
            </p>
            <WaitlistForm source="footer" cta="REJOINDRE LA BÊTA"
              note="Un seul message, le jour de la sortie. Rien d'autre." />
          </div>
          <div className="cta-art">
            <Img name="gribou-applaudit" alt="Gribou applaudit" w={260} h={260} />
          </div>
        </section>
        <div className="wrap foot">
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
