# Kurso — site de présentation

Page unique pour la bêta de [Kurso](https://github.com/Nitrozer/kurso-swift).
React 19, TypeScript, Vite. La page est **pré-rendue au build** : le visiteur
reçoit du HTML déjà peint, React ne sert qu'à faire vivre les deux formulaires.

## Résultats Lighthouse

| Profil | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Ordinateur | **100** | **100** | **100** | **100** |
| Mobile | **97** | **100** | **100** | **100** |

FCP 0,4 s · LCP 0,5 s · TBT 0 ms · CLS 0 (ordinateur).

Ce qui a été fait pour y arriver :

- **Pré-rendu statique** — `react-dom/server` au build, hydratation ensuite.
- **Pas de `supabase-js`** — une insertion se fait en un `fetch` sur l'API REST.
  La bibliothèque coûtait ~120 Ko pour une seule requête.
- **CSS en ligne** — 2 Ko compressés, l'aller-retour bloquait ~700 ms.
- **Polices auto-hébergées** en woff2 découpé sur la plage latine, `font-display: swap`,
  et seules les deux du haut de page sont préchargées.
- **Images en AVIF et WebP** avec repli PNG, `width`/`height` toujours déclarés
  (CLS à 0), image du héros préchargée, le reste en `loading="lazy"`.
  Le Gribou du héros passe de 426 Ko à 6 Ko.

## Démarrer

```bash
npm install
cp .env.example .env    # puis renseigner le projet Supabase
npm run dev
```

## Base de données

```bash
supabase db push        # applique supabase/migrations/0001_waitlist.sql
```

La table `waitlist` est en RLS **insertion seule** : la clé anon du site peut
déposer une adresse, jamais lire la liste. C'est voulu — la clé part dans le
navigateur, elle est publique par conception.

> **Ne jamais mettre la clé `service_role` dans ce projet.** Elle ignore RLS.

## Mise en ligne

`npm run build` produit `dist/`, servable tel quel (Vercel, Netlify, Pages).
Aucun serveur n'est nécessaire.

## Reste à faire

- Page `/confidentialite` — obligatoire dès lors qu'on collecte des adresses.
- L'envoi du message de sortie : Supabase stocke, il n'envoie pas.
