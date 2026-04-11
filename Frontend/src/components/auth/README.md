# Module d'Authentification - ERP Location de Voiture

Ce répertoire contient les composants et la logique de l'interface utilisateur pour le système d'authentification. Le module a été refactorisé pour offrir une expérience utilisateur premium, entièrement localisée en français.

## 🏗️ Architecture Technique

L'authentification repose sur une architecture à trois couches :

1.  **Frontend (React/Vite)** : Situé dans `/Frontend`. Communique avec la passerelle via Axios.
2.  **API Gateway (Passerelle)** : Située dans `/services/api-gateway`. Agit comme un **proxy transparent**. Elle redirige toutes les requêtes `/api/auth/*` vers le service d'authentification sans modifier les chemins.
3.  **Auth Service** : Situé dans `/services/auth-service`. Gère la logique métier, la validation Zod, et la base de données via Prisma.

## ✨ Fonctionnalités Clés

-   **Localisation Complète** : Tout le parcours (Connexion, Inscription, Vérification) est en français, y compris les messages d'erreur du backend.
-   **Inscription Simplifiée** : Les champs **CIN** et **Téléphone** sont désormais **optionnels**. Seuls le nom, l'email et le mot de passe sont requis pour créer un compte.
-   **Sécurité des Jetons** : Les codes de validation par e-mail expirent après **60 minutes**.
-   **Compte à Rebours en Temps Réel** : Une barre d'état avec timer est affichée sur la page de validation pour informer l'utilisateur du temps restant avant l'expiration du code.
-   **Design Premium** : Utilisation de Tailwind CSS avec des fonds d'écran haute résolution et une interface épurée.

## 🚀 Guide de Démarrage Rapide

Pour lancer l'ensemble du projet (Passerelle + Auth Service + Frontend) simultanément, utilisez la commande suivante à la **racine du projet** :

```powershell
npm run dev
```

### Synchronisation de la Base de Données

Si vous modifiez le schéma Prisma ou si vous installez le projet pour la première fois, utilisez la commande `db push` pour synchroniser votre base de données locale sans perdre de données :

```powershell
cd services/auth-service
npx prisma db push
```

## 🛠️ Maintenance et Modifications

-   **Traductions** : Les messages d'erreur sont centralisés dans `auth-service/src/errors/auth.errors.ts` et les validateurs dans `auth-service/src/validators/auth.validator.ts`.
-   **Styles** : Les composants React se trouvent dans `Frontend/src/components/auth/`.
-   **Images** : Les visuels hero sont stockés dans `Frontend/src/assets/auth-imgs/`.
