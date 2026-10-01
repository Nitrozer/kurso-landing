import { useEffect, useState } from 'react'

/** Le chapitre affiche : son numero, son nom, sa couleur. */
export type Chapter = { n: string; name: string; bg: string }

/** Les couleurs de barre d'adresse, une par chapitre. Safari sur iPhone
 *  teinte tout le haut de l'ecran : si elle ne suit pas, le film s'arrete
 *  net a deux centimetres du bord. */
const THEME: Record<string, string> = {
  ink: '#131A33', blue: '#3B5BFF', yellow: '#FFD24D',
  green: '#17B26A', pink: '#FF8FA3', paper: '#F6F8FF',
}

const calm = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const fine = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Allume les animations, une fois le script en vie.
 *
 * Rien n'est cache tant que `motion` n'est pas posee sur `<html>` : la page
 * est pre-rendue au build et doit rester entierement lisible sans une ligne
 * de JavaScript. Un site dont le texte attend un observateur pour apparaitre
 * est un site vide pour qui coupe le script, pour un robot d'indexation, et
 * pendant les trois cents millisecondes ou React demarre.
 */
export function useMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const apply = () => {
      const root = document.documentElement
      root.classList.toggle('motion', !reduce.matches)
      root.classList.toggle('fine', pointer.matches && !reduce.matches)
    }
    apply()
    reduce.addEventListener('change', apply)
    pointer.addEventListener('change', apply)
    return () => {
      reduce.removeEventListener('change', apply)
      pointer.removeEventListener('change', apply)
    }
  }, [])
}

/** Revele les elements marques `data-rise` quand ils entrent dans le cadre. */
export function useReveal() {
  useEffect(() => {
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        seen.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 })

    document.querySelectorAll('[data-rise]').forEach((el) => seen.observe(el))
    return () => seen.disconnect()
  }, [])
}

/** Le chapitre qui traverse le milieu de l'ecran donne sa couleur a la page. */
export function useChapter(): Chapter | null {
  const [chapter, setChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    const onAir = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const el = entry.target as HTMLElement
        const bg = el.dataset.bg ?? 'paper'
        document.documentElement.setAttribute('data-bg', bg)
        document.querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', THEME[bg] ?? '#F6F8FF')
        setChapter({ n: el.dataset.n ?? '', name: el.dataset.name ?? '', bg })
      }
    }, { rootMargin: '-50% 0px -50% 0px' })

    document.querySelectorAll('[data-bg]').forEach((el) => onAir.observe(el))
    return () => onAir.disconnect()
  }, [])

  return chapter
}

/**
 * La boucle unique de la page.
 *
 * Le defilement du navigateur est brut : il saute d'un cran a l'autre. Au
 * lieu de le confisquer — ce qui casse le clavier, le trackpad et les
 * ancres — on le laisse tel quel et on LISSE les valeurs qu'on en tire :
 * tout ce qui bouge suit une position amortie, avec un temps de retard.
 * C'est ce retard qui donne la glisse, sans rien prendre a personne.
 *
 * Une seule boucle pour toute la page, et elle s'arrete d'elle-meme des que
 * plus rien ne bouge : une boucle qui tourne pour rien vide une batterie.
 */
export function useStage() {
  useEffect(() => {
    if (calm()) return
    const root = document.documentElement
    let items: HTMLElement[] = []
    const measure = () => {
      items = Array.from(document.querySelectorAll<HTMLElement>('[data-par]'))
    }
    measure()

    let smooth = window.scrollY
    let last = window.scrollY
    let idle = 0
    let frame = 0

    const tick = () => {
      const target = window.scrollY
      smooth += (target - smooth) * 0.1
      const speed = target - last
      last = target

      // La vitesse sert aux penchements : un bloc qui se redresse apres un
      // coup de molette donne le poids que le defilement n'a pas.
      root.style.setProperty('--vel', Math.max(-36, Math.min(36, speed)).toFixed(2))

      const height = window.innerHeight
      const drift = target - smooth
      for (const el of items) {
        const box = el.getBoundingClientRect()
        // La boite est mesuree sur le defilement reel : on la ramene sur le
        // defilement amorti, sinon le retard ne se voit pas.
        const top = box.top + drift
        // 0 quand le haut touche le bas de l'ecran, 1 quand le bas touche
        // le haut de l'ecran.
        const p = Math.max(0, Math.min(1, (height - top) / (height + box.height)))
        el.style.setProperty('--p', p.toFixed(4))
        el.style.setProperty('--pc', (p * 2 - 1).toFixed(4))
      }

      idle = Math.abs(drift) < 0.2 && Math.abs(speed) < 0.2 ? idle + 1 : 0
      frame = idle < 30 ? requestAnimationFrame(tick) : 0
      if (!frame) root.style.setProperty('--vel', '0')
    }

    const wake = () => { if (!frame) { idle = 0; frame = requestAnimationFrame(tick) } }
    const onResize = () => { measure(); wake() }
    frame = requestAnimationFrame(tick)

    window.addEventListener('scroll', wake, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', wake)
      window.removeEventListener('resize', onResize)
    }
  }, [])
}

/**
 * Les scenes.
 *
 * Une scene est une section haute de plusieurs ecrans dont le decor reste
 * colle au milieu : on ne descend pas DANS la scene, on la joue. La boucle
 * y ecrit `--q`, de 0 a 1, et toute la choregraphie se fait ensuite en CSS
 * — chaque objet decoupe sa propre tranche de cette minute.
 *
 * Separee de `useStage` parce que la mesure n'est pas la meme : ici on veut
 * l'avancee DANS la section collee, pas la traversee de l'ecran.
 */
export function useScenes() {
  useEffect(() => {
    if (calm()) return
    let scenes: HTMLElement[] = []
    const measure = () => {
      scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    }
    measure()
    if (!scenes.length) return

    let frame = 0
    const place = () => {
      frame = 0
      // Sous 900 px la scene n'est plus collee : elle se replie sur son
      // etat final, decrit en CSS. Lui ecrire une avancee ici la laisserait
      // vide, puisqu'il n'y a plus rien a traverser.
      const narrow = window.innerWidth < 900
      for (const scene of scenes) {
        if (narrow) { scene.style.removeProperty('--q'); continue }
        const box = scene.getBoundingClientRect()
        const travel = box.height - window.innerHeight
        const q = travel > 0 ? Math.max(0, Math.min(1, -box.top / travel)) : 0
        scene.style.setProperty('--q', q.toFixed(4))
      }
    }
    const ask = () => { if (!frame) frame = requestAnimationFrame(place) }

    place()
    window.addEventListener('scroll', ask, { passive: true })
    window.addEventListener('resize', () => { measure(); ask() })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', ask)
    }
  }, [])
}

/**
 * Le curseur : un point d'encre qui suit la souris avec du retard, et qui
 * s'ouvre en anneau au-dessus de ce qui se clique.
 *
 * Uniquement la ou il y a vraiment une souris : sur un ecran tactile il n'y
 * a rien a suivre, et le point resterait colle dans un coin.
 */
export function useCursor() {
  useEffect(() => {
    if (calm() || !fine()) return

    const dot = document.createElement('div')
    dot.className = 'cursor'
    dot.setAttribute('aria-hidden', 'true')
    document.body.appendChild(dot)

    let x = window.innerWidth / 2, y = window.innerHeight / 2
    let cx = x, cy = y
    let frame = requestAnimationFrame(function tick() {
      cx += (x - cx) * 0.2
      cy += (y - cy) * 0.2
      dot.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(tick)
    })

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY
      dot.classList.add('is-on')
      const target = e.target as HTMLElement | null
      dot.classList.toggle('is-open', !!target?.closest?.('a, button, input, .cinema, .deck, .stage'))
    }
    const leave = () => dot.classList.remove('is-on')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      dot.remove()
    }
  }, [])
}

/**
 * Les boutons aimantes : le bouton vient vers la souris quand elle
 * s'approche, et revient a sa place quand elle s'eloigne.
 */
export function useMagnets() {
  useEffect(() => {
    if (calm() || !fine()) return
    const magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]'))
    if (!magnets.length) return

    const move = (e: PointerEvent) => {
      for (const el of magnets) {
        const box = el.getBoundingClientRect()
        const dx = e.clientX - (box.left + box.width / 2)
        const dy = e.clientY - (box.top + box.height / 2)
        const near = Math.hypot(dx, dy) < box.width / 2 + 80
        el.style.setProperty('--mx', near ? `${(dx * 0.26).toFixed(1)}px` : '0px')
        el.style.setProperty('--my', near ? `${(dy * 0.3).toFixed(1)}px` : '0px')
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
}

/**
 * Le rideau d'ouverture.
 *
 * Il n'existe que si le script tourne, il ne passe qu'une fois par visite,
 * et il ne retient jamais la page : le contenu est deja peint dessous.
 */
export function useCurtain() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (calm() || sessionStorage.getItem('kurso.vu') === '1') return
    const root = document.documentElement
    setOpen(true)
    root.classList.add('curtain')
    const t1 = setTimeout(() => root.classList.add('curtain-out'), 1150)
    const t2 = setTimeout(() => {
      root.classList.remove('curtain', 'curtain-out')
      sessionStorage.setItem('kurso.vu', '1')
      setOpen(false)
    }, 2050)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return open
}
