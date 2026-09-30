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
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      document.documentElement.classList.toggle('motion', !calm.matches)
    }
    apply()
    calm.addEventListener('change', apply)
    return () => calm.removeEventListener('change', apply)
  }, [])
}

/**
 * Revele les elements marques `data-rise` quand ils entrent dans le cadre.
 *
 * Un seul observateur pour toute la page, et chaque element est oublie une
 * fois montre : ce qui est apparu n'a plus de raison d'etre surveille.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const seen = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        seen.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 })

    document.querySelectorAll('[data-rise]').forEach((el) => seen.observe(el))
    return () => seen.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Le chapitre qui traverse le milieu de l'ecran donne sa couleur a la page.
 *
 * La marge de -50 % des deux cotes reduit la zone d'observation a une seule
 * ligne, au centre : une section est « a l'antenne » exactement quand elle
 * croise cette ligne, sans jamais deux reponses a la fois.
 */
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
 * Ecrit dans `--p` l'avancee de chaque element marque `data-par`, de -1
 * quand il arrive par le bas a +1 quand il sort par le haut.
 *
 * Une seule boucle pour toute la page, appelee au plus une fois par image :
 * un ecouteur de defilement par element ferait ramer le telephone.
 */
export function useParallax() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-par]'))
    if (!items.length) return
    let queued = false

    const place = () => {
      queued = false
      const height = window.innerHeight
      for (const el of items) {
        const box = el.getBoundingClientRect()
        const middle = box.top + box.height / 2
        const p = 1 - (middle / (height / 2))
        el.style.setProperty('--p', Math.max(-1.5, Math.min(1.5, p)).toFixed(3))
      }
    }
    const ask = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(place)
    }

    place()
    window.addEventListener('scroll', ask, { passive: true })
    window.addEventListener('resize', ask)
    return () => {
      window.removeEventListener('scroll', ask)
      window.removeEventListener('resize', ask)
    }
  }, [])
}
