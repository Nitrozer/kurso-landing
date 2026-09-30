/** Les traits sont DESSINES, jamais empruntes a une bibliotheque d'icones :
 *  c'est la regle de l'app, et c'est ce qui fait que le site et le cahier
 *  ont la meme main. Chaque trace se pose au scroll, comme au feutre. */

/** Le surligneur jaune, passe derriere un mot.
 *  La bande est un pseudo-element plutot qu'un SVG : elle doit epouser la
 *  largeur du mot quelle que soit la casse et la coupure de ligne. */
export function Marker({ children }: { children: React.ReactNode }) {
  return <span className="mark" data-rise>{children}</span>
}

/** Le tour de feutre autour d'un mot : le geste du film, « Entoure ». */
export function Scribble({ children }: { children: React.ReactNode }) {
  return (
    <span className="scribble" data-rise>
      {/* Pas de `pathLength` : le navigateur l'ignore ici, et le pointille
          se calculait alors sur un tiret d'un pixel. Les longueurs du
          pointille sont donnees en unites du viewBox (le trace en mesure
          272), donc elles ne bougent pas avec la taille du mot. */}
      <svg className="scribble-stroke" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M6 22 C 7 8, 30 3, 60 3 C 92 3, 114 9, 114 21 C 114 32, 88 37, 58 37 C 28 37, 5 32, 5 20 C 5 12, 15 7, 27 5" />
      </svg>
      <span className="scribble-word">{children}</span>
    </span>
  )
}

/** La fleche du bas de page : « il y a la suite ». */
export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 24 34" aria-hidden="true">
      <path d="M12 2 L12 28 M3 20 L12 30 L21 20" />
    </svg>
  )
}

/** Une image en trois formats : AVIF, WebP, puis PNG pour les navigateurs
 *  anciens. width/height sont toujours donnes — sans eux la page saute au
 *  chargement. */
export function Img({ name, alt, w, h, className, eager }: {
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
