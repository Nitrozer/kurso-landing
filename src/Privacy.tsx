/** La page de confidentialité.
 *
 *  Écrite à partir de ce que le site fait réellement, pas d'un modèle : la
 *  table `waitlist` ne contient qu'une adresse, une origine de clic et une
 *  date, il n'y a aucun traceur, et les polices sont servies depuis ce
 *  domaine. Une politique qui promet moins que ce qu'elle décrit ne vaut
 *  rien ; une qui décrit des cookies inexistants non plus.
 */
export default function Privacy() {
  return (
    <>
      <header className="wrap nav">
        <a className="logo" href="/">
          <span className="logo-mark">K</span>
          <span className="logo-word">Kurso</span>
        </a>
        <a className="btn" href="/">Retour au site</a>
      </header>

      <main className="wrap legal">
        <p className="mono-label">Dernière mise à jour : 15 septembre 2026</p>
        <h1>Confidentialité</h1>
        <p className="lede">
          Ce site ne collecte qu'une chose : l'adresse e-mail que tu écris toi-même
          dans le formulaire. Pas de cookie, pas de traceur, pas de mesure d'audience.
          Cette page dit exactement ce qui est enregistré, pourquoi, et comment le
          faire effacer.
        </p>

        <h2>Ce qui est enregistré</h2>
        <p>Quand tu rejoins la liste d'attente, trois informations sont stockées :</p>
        <ul>
          <li><b>Ton adresse e-mail</b>, telle que tu l'écris, mise en minuscules.</li>
          <li><b>L'endroit où tu as cliqué</b> — en haut de la page ou en bas. Cela sert
            uniquement à savoir quelle partie du site convainc.</li>
          <li><b>La date et l'heure</b> de l'inscription.</li>
        </ul>
        <p>
          Rien d'autre. Pas ton nom, pas ton établissement, pas ton adresse IP, pas
          le navigateur utilisé.
        </p>

        <h2>Ce qui n'est pas fait</h2>
        <ul>
          <li><b>Aucun cookie</b> n'est déposé. Le site n'en a pas besoin, donc il n'y en a pas
            — et c'est pour ça qu'aucune bannière ne te demande de consentement.</li>
          <li><b>Aucune mesure d'audience</b>, aucun outil d'analytics, aucun pixel.</li>
          <li><b>Aucune police externe.</b> Les caractères sont servis depuis ce domaine :
            ta visite n'est signalée à aucun tiers, pas même à Google Fonts.</li>
          <li><b>Aucune revente, aucun partage</b> de ton adresse, à personne, jamais.</li>
        </ul>

        <h2>À quoi ça sert</h2>
        <p>
          À une seule chose : <b>te prévenir le jour où la bêta ouvre</b>. Un message,
          peut-être deux si la date bouge. Pas de lettre d'information, pas de
          relance commerciale.
        </p>
        <p>
          La base juridique est ton <b>consentement</b> : tu donnes ton adresse, tu peux
          la retirer quand tu veux.
        </p>

        <h2>Combien de temps</h2>
        <p>
          Jusqu'à l'ouverture de la bêta, puis <b>au maximum trois mois après</b> l'envoi
          du message d'annonce. Passé ce délai, la liste est effacée. Si tu deviens
          utilisateur entre-temps, ton adresse reste rattachée à ton compte et non à
          cette liste.
        </p>

        <h2>Où c'est stocké</h2>
        <p>
          Sur <b>Supabase</b>, qui héberge la base de données. La table n'est accessible
          qu'en écriture depuis ce site : la clé publique du navigateur permet
          d'ajouter une adresse, et rien d'autre — pas même de lire la liste.
        </p>
        <p className="note-block">
          Tes <b>notes de cours ne passent jamais par ici.</b> L'application Kurso garde
          pages, cartes, audio et PDF dans ton propre iCloud. Ce site ne les voit
          pas, ce serveur ne les stocke pas : ils n'existent que sur tes appareils.
        </p>

        <h2>Tes droits</h2>
        <p>
          Le RGPD te donne le droit d'accéder à ton adresse, de la corriger, de la
          faire effacer, et de retirer ton consentement. En pratique, pour cette
          liste, tout se résume à une demande :
        </p>
        <p>
          Écris à <a href="mailto:contact@kurso.app">contact@kurso.app</a> depuis
          l'adresse concernée. Elle est supprimée sous sept jours, et je te confirme
          quand c'est fait. Aucune justification à donner.
        </p>
        <p>
          Si la réponse ne te convient pas, tu peux saisir la <b>CNIL</b> —{' '}
          <a href="https://www.cnil.fr/fr/plaintes" rel="noopener noreferrer">cnil.fr/fr/plaintes</a>.
        </p>

        <h2>Responsable du traitement</h2>
        <p>
          Kurso est un projet personnel, développé par un étudiant.
          Contact : <a href="mailto:contact@kurso.app">contact@kurso.app</a>.
        </p>

        <h2>Si cette page change</h2>
        <p>
          La date en haut est mise à jour. Si un changement touche ce qui est
          collecté ou l'usage qui en est fait, les personnes inscrites sont
          prévenues par e-mail avant qu'il s'applique.
        </p>
      </main>

      <footer>
        <div className="wrap foot">
          <span>Kurso · fait par un étudiant, pour des étudiants</span>
          <nav>
            <a href="/">Accueil</a>
            <a href="mailto:contact@kurso.app">Contact</a>
          </nav>
        </div>
      </footer>
    </>
  )
}
