# TEKANDME_Test_Fatma_Chirchi.-
# Application de Gestion de Tâches

## Prérequis
- Node.js (v18+)
- npm ou yarn
- Git

## Installation

### 1. Cloner le dépôt
```bash
git clone [URL_DU_DEPOT]
cd todo-app
```

### 2. Configuration du Backend (Strapi)
```bash
cd backend
npm install
npm run develop
```

#### Configuration Strapi
1. Accéder à `http://localhost:1337/admin`
2. Créer un compte administrateur
3. Créer un nouveau modèle "Task" avec les champs suivants :
   - title (Text, Required)
   - description (Rich Text)
   - status (Enumeration: pending, completed)
   - startDate (Date)
   - endDate (Date)
   - priority (Enumeration: low, medium, high)
   - isOverdue (Boolean)

4. Configurer les permissions d'API dans "Roles & Permissions"
   - Autoriser les actions publiques (create, find, update, delete)

### 3. Configuration du Frontend (Next.js)
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Variables d'Environnement
Créer un fichier `.env.local` dans le dossier frontend :
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Fonctionnalités
- Créer des tâches
- Éditer des tâches
- Supprimer des tâches
- Filtrer les tâches
- Rechercher des tâches
- Marquage des tâches comme complétées

## Technologies Utilisées
- Backend: Strapi
- Frontend: Next.js
- Styling: Tailwind CSS
- State Management: React Hooks
- API: Axios

## Dépannage
- Assurez-vous que Strapi est en cours d'exécution avant de démarrer le frontend
- Vérifiez que toutes les dépendances sont installées
- Consultez la console pour les messages d'erreur

## Contribution
1. Forker le dépôt
2. Créer une branche de fonctionnalité
3. Commiter vos modifications
4. Créer une Pull Request