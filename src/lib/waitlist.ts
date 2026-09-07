/** Une insertion ne justifie pas les ~120 Ko de supabase-js : l'API REST
 *  de PostgREST se parle en `fetch`, et les regles RLS font le travail. */
const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export type Source = 'hero' | 'footer'

export async function joinWaitlist(email: string, source: Source): Promise<void> {
  if (!URL_BASE || !ANON) throw new Error('config')
  const res = await fetch(`${URL_BASE}/rest/v1/waitlist`, {
    method: 'POST',
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal,resolution=ignore-duplicates',
    },
    body: JSON.stringify({ email: email.trim().toLowerCase(), source }),
  })
  if (!res.ok && res.status !== 409) throw new Error(String(res.status))
}
