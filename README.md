# Kurso — site de présentation

**Français** · [English](README.en.md)

Page unique pour la bêta de [Kurso](https://github.com/Nitrozer/kurso-swift).

Le site **est** la maquette. `maquette/site-v3.dc.html` vient de l'editeur de maquette ;
`tools/build-page.mjs` la transforme en page servable sans jamais réécrire un
seul style en ligne — c'est ce qui garantit que le rendu est celui qui a été
dessiné, et non une interprétation. Relancer après chaque nouvelle version :

```bash
npm run page
```

Le convertisseur ne touche qu'à ce que l'éditeur de maquette fournissait et que
le site doit fournir autrement : les états `style-hover`, les écouteurs, les
deux blocs conditionnels, les chemins des ressources. Le script de mouvement
(`src/logic.js`, 60 Ko) est repris **tel quel**.

Pas de framework : HTML statique, un module de 23 Ko compressés, et three.js
chargé à part, seulement pour la mascotte en 3D.

## Résultats Lighthouse

| Profil | Performance | Accessibilité | Bonnes pratiques | SEO |
|---|---|---|---|---|
| Ordinateur | **98** | **96** | **100** | **100** |
| Mobile | **75** | **96** | **100** | **100** |

FCP 0,4 s · LCP 1,1 s · TBT 40 ms · CLS 0 (ordinateur).

Ce qui a été fait pour y arriver :

- **Rien à hydrater** — la page part en HTML complet, le script ne fait que
  l'animer. Sans React, le site a perdu 70 Ko compressés.
- **Modèle 3D compressé** (meshopt) — 3,98 Mo → 1,09 Mo. L'écran d'ouverture
  attend après lui : à lui seul, ce passage a fait monter la note de 47 à 98
  et la LCP de 5,0 s à 1,1 s. La compression des textures, elle, délavait les
  matériaux : on ne touche qu'à la géométrie.
- **three.js dans son propre morceau**, chargé seulement quand la scène démarre.
- **Pas de `supabase-js`** — une insertion se fait en un `fetch` sur l'API REST.
  La bibliothèque coûtait ~120 Ko pour une seule requête.
- **CSS en ligne**, polices auto-hébergées en woff2, `font-display: swap`,
  et seules les deux du haut de page sont préchargées.
- **L'image de secours de Gribou n'est pas téléchargée** tant que WebGL marche :
  un `src` posé sur une image en `display:none` part quand même — 140 Ko pour
  rien à chaque visite.

### Deux points connus

- **Contraste** : dix libellés en `#6C7590` et `#3B5BFF` tombent à 4,2–4,35:1,
  sous le 4,5:1 attendu pour du petit texte. Ce sont des couleurs de la
  maquette : les changer, c'est s'en écarter. À décider.
- **LCP mobile** : l'ouverture attend le modèle 3D, avec un plafond de 8 s
  inscrit dans la maquette. Sur une connexion bridée, c'est ce plafond qu'on
  mesure. Baisser le plafond, ou se rabattre sur l'image quand la connexion
  est lente, relève du parti pris — pas d'une correction.

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

La migration est **deja appliquee** sur le projet `kurso`. La table est vide.

La table `waitlist` est en RLS **insertion seule** : la clé anon du site peut
déposer une adresse, jamais lire la liste. C'est voulu — la clé part dans le
navigateur, elle est publique par conception.

> **Ne jamais mettre la clé `service_role` dans ce projet.** Elle ignore RLS.

Conséquence de ce choix : pas d'en-tête `resolution=ignore-duplicates` côté
client. Il ferait générer un `ON CONFLICT`, qui exige de pouvoir relire la
table — ce que `anon` n'a pas le droit de faire. Une adresse déjà inscrite
ressort donc en `409`, traité comme un succès.

## Ce que le build produit

`npm run build` écrit `dist/`, servable tel quel (Vercel, Netlify, Pages) :

```
dist/index.html                  la page d'accueil, en HTML complet
dist/confidentialite/index.html  la page RGPD, sans une ligne de JavaScript
```

Aucun serveur n'est nécessaire.

## Reste à faire

- La page `/confidentialite` existe, mais il lui manque deux mentions :
  l'identité du **responsable du traitement**, et le lieu d'hébergement de la
  base — le projet Supabase est en région **West EU (Paris)**.
- L'envoi du message de sortie : Supabase stocke, il n'envoie pas.
