# TPForum - Forum de Discussion

Un forum de discussion moderne construit avec Vue.js 3 et Firebase.

## Fonctionnalités

- **Authentification des utilisateurs**
  - Inscription et connexion
  - Réinitialisation de mot de passe
  - Gestion de profil

- **Gestion des discussions**
  - Création de discussions
  - Réponses aux discussions
  - Modification et suppression des messages
  - Organisation par catégories

- **Interface utilisateur**
  - Design moderne et responsive
  - Navigation intuitive
  - Affichage des statistiques
  - Support multilingue (français)

## Technologies utilisées

- **Frontend**
  - Vue.js 3
  - Vue Router
  - Pinia (gestion d'état)
  - Bootstrap-Vue 3
  - date-fns (formatage des dates)

- **Backend**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Hosting

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/tpforum.git
cd tpforum
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez Firebase :
   - Créez un projet Firebase
   - Copiez les informations de configuration dans `src/firebase/config.js`

4. Lancez l'application en mode développement :
```bash
npm run dev
```

5. Pour la production :
```bash
npm run build
```

## Structure du projet

```
src/
├── components/     # Composants réutilisables
├── views/          # Pages de l'application
├── stores/         # Stores Pinia
├── router/         # Configuration du routeur
├── firebase/       # Configuration Firebase
└── assets/         # Ressources statiques
```

## Déploiement

1. Installez Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Connectez-vous à Firebase :
```bash
firebase login
```

3. Initialisez le projet :
```bash
firebase init
```

4. Déployez l'application :
```bash
firebase deploy
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
