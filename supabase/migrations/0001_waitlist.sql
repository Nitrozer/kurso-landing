-- Liste d'attente de la beta. Aucune donnee de cours ici : uniquement une
-- adresse donnee volontairement par un visiteur qui n'est pas encore
-- utilisateur. Les notes restent dans l'iCloud de chacun.

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text not null default 'hero',
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Le site public ne porte que la cle anon. Il peut deposer une adresse,
-- et c'est tout : sans politique de lecture, la liste reste invisible.
drop policy if exists "inscription publique" on public.waitlist;
create policy "inscription publique"
  on public.waitlist for insert to anon
  with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,}$'
    and length(email) <= 254
    and source in ('hero', 'footer')
  );

comment on table public.waitlist is
  'Beta Kurso. RGPD : finalite unique — prevenir de la sortie. A purger apres envoi.';
