import { useId, useState } from 'react'
import { joinWaitlist, type Source } from '../lib/waitlist'

type State = 'idle' | 'sending' | 'done' | 'error'

export default function WaitlistForm({ source, cta, note }: {
  source: Source; cta: string; note: string
}) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [trap, setTrap] = useState('')
  const [state, setState] = useState<State>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    // Piege a robots : un humain ne remplit pas un champ qu'il ne voit pas.
    if (trap) { setState('done'); return }
    setState('sending')
    try { await joinWaitlist(email, source); setState('done') }
    catch { setState('error') }
  }

  if (state === 'done') {
    return (
      <p className="note note-ok" role="status">
        C'est noté. Un seul message, le jour de la sortie.
      </p>
    )
  }

  return (
    <>
      <form className="form" onSubmit={onSubmit} noValidate>
        <label className="hp" htmlFor={`${id}-c`} aria-hidden="true">Ne pas remplir</label>
        <input className="hp" id={`${id}-c`} type="text" tabIndex={-1} autoComplete="off"
          aria-hidden="true" value={trap} onChange={e => setTrap(e.target.value)} />

        <label className="hp" htmlFor={`${id}-e`}>Ton adresse e-mail</label>
        <input id={`${id}-e`} type="email" required autoComplete="email"
          placeholder="ton@email.fr" value={email}
          onChange={e => setEmail(e.target.value)} />

        <button className={`btn${source === 'footer' ? ' btn-yellow' : ''}`}
          type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'UN INSTANT…' : cta}
        </button>
      </form>
      <p className={`note${state === 'error' ? ' note-err' : ''}`} role="status">
        {state === 'error'
          ? "Ça n'est pas passé. Réessaie dans un instant."
          : note}
      </p>
    </>
  )
}
