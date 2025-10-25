# 🥡 FoodExpress – Documentation Technique

## 📘 Vue d'ensemble

**FoodExpress** est un projet d'API backend conçu pour une plateforme de commande de nourriture en ligne.
L'objectif est de développer une **API RESTful** utilisant **Node.js** et **Express.js (ou Fastify.js)** qui gère :

- Gestion des utilisateurs
- Enregistrement des restaurants
- Gestion des menus

L'API doit être **stateless**, **sécurisée (JWT)** et bien documentée (**OpenAPI/Swagger**).

> 🧩 Aucun frontend requis — uniquement l'API.

---

## 🏗️ Architecture

### 🔹 Pile technologique

| Couche                    | Technologie                 |
| ------------------------- | --------------------------- |
| Environnement d'exécution | Node.js                     |
| Framework                 | Express.js                  |
| Base de données           | MongoDB (via Mongoose ODM)  |
| Authentification          | JWT                         |
| Validation                | Joi                         |
| Tests                     | Jest + Supertest            |
| Documentation             | Swagger / OpenAPI           |
| Sécurité                  | Helmet, CORS, Rate Limiting |
| Logging                   | Winston                     |

---

## 📂 Structure du projet

```bash
foodexpress/
│
├── src/
│   ├── app.js                 # Application Express
│   ├── server.js              # Point d'entrée du serveur
│   ├── swagger.js             # Configuration Swagger/OpenAPI
│   ├── config/
│   │   ├── mongodb.js         # Connexion MongoDB
│   │   └── security.js        # Configuration sécurité (CORS, Rate limiting)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── restaurantController.js
│   │   └── menuController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   └── Menu.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── restaurants.js
│   │   └── menus.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   └── pagination.js
│
├── tests/
│   ├── users.test.js
│   ├── restaurants.test.js
│   ├── menus.test.js
│   ├── others.test.js
│   └── setup.js
│
├── scripts/
│   ├── seed.js
│   └── wipe.js
│
├── docs/
│   ├── FoodExpress_Documentation.md
│   ├── Documentation_Utilisateur_FoodExpress.md
│   └── FoodExpress_TODO.md
│
├── package.json
├── .env
├── README.md
├── jest.config.js
├── .eslintrc.cjs
├── .prettierrc
├── commitlint.config.js
├── .gitignore
├── .husky/
├── .nyc_output/
└── test_swagger_runner.js
```

---

## ⚙️ Configuration et installation

### Prérequis

- Node.js ≥ 20
- MongoDB ou compte MongoDB Atlas
- npm ou yarn

### Installation

```bash
git clone https://github.com/AcronChiron/3APIS_2025_foodexpress.git
cd foodexpress
npm install
```

### Variables d'environnement (`.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/foodexpress
JWT_SECRET=your_jwt_secret_key
CORS_ALLOWLIST=                                    # Optional: comma-separated origins (e.g., http://localhost:3000,https://myapp.com)
RATE_LIMIT_WINDOW_MS=900000                         # Optional: rate limit window in ms (default: 900000 = 15 minutes)
RATE_LIMIT_MAX=100                                  # Optional: max requests per window per IP (default: 100)
```

### Démarrer le serveur

```bash
npm run dev
```

---

## 🔐 Authentification

L'authentification basée sur JWT est utilisée pour tous les points de terminaison protégés.

### Point de terminaison Authentification (`/auth`)

#### `POST /auth/login`

Permet à un utilisateur de se connecter et de recevoir un jeton JWT.

**Corps de la requête :**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse de succès (200) :**

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64b...",
      "email": "user@example.com",
      "username": "user123",
      "role": "user",
      "createdAt": "2023-...",
      "updatedAt": "2023-..."
    }
  }
}
```

**Erreurs :**

- `400 Bad Request` : Email ou mot de passe manquant
- `401 Unauthorized` : Identifiants invalides

### Flux de jeton

1. L'utilisateur se connecte via `POST /auth/login`.
2. Le serveur valide les identifiants et génère un **JWT** en utilisant `jsonwebtoken`.
3. Le jeton est envoyé dans les en-têtes sous la forme `Authorization: Bearer <token>`.
4. Le middleware `auth.js` valide le jeton avant de traiter les requêtes protégées.

- **Routes publiques** :
  `/health`, `/health/ready`, `/auth/login`, `/restaurants` (GET), `/menus` (GET)

- **Routes protégées** :
  `/users`, `/restaurants` (POST, PUT, DELETE), `/menus` (POST, PUT, DELETE)

---

## 👥 Point de terminaison Utilisateurs (`/users`)

### Modèle Utilisateur

| Champ     | Type     | Requis | Validation                               | Description                     |
| --------- | -------- | ------ | ---------------------------------------- | ------------------------------- |
| \_id      | ObjectId | Auto   | -                                        | Identifiant unique MongoDB      |
| email     | String   | ✅     | unique, lowercase, email regex           | Email de l'utilisateur (unique) |
| username  | String   | ✅     | unique, minlength: 3, trim               | Nom d'utilisateur (unique)      |
| password  | String   | ✅     | minlength: 6, select: false              | Mot de passe hashé (bcrypt)     |
| role      | String   | Non    | enum: ["user", "admin"], default: "user" | Rôle utilisateur                |
| createdAt | Date     | Auto   | -                                        | Date de création (timestamp)    |
| updatedAt | Date     | Auto   | -                                        | Date de mise à jour (timestamp) |

### Permissions

- **Anonyme :** peut `POST /users` (s'inscrire)
- **Utilisateur :** peut modifier/supprimer son propre compte
- **Admin :** contrôle total sur les utilisateurs

### Exemples de routes

| Méthode  | Route        | Accès        | Description                          |
| -------- | ------------ | ------------ | ------------------------------------ |
| `POST`   | `/users`     | Public       | Inscrire un nouvel utilisateur       |
| `GET`    | `/users/:id` | Admin / Self | Obtenir les détails de l'utilisateur |
| `PUT`    | `/users/:id` | Auth         | Mettre à jour l'utilisateur          |
| `DELETE` | `/users/:id` | Auth         | Supprimer l'utilisateur              |

---

## 🍽️ Point de terminaison Restaurants (`/restaurants`)

### Modèle Restaurant

| Champ         | Type     | Requis | Validation                                   | Description                     |
| ------------- | -------- | ------ | -------------------------------------------- | ------------------------------- |
| \_id          | ObjectId | Auto   | -                                            | Identifiant unique MongoDB      |
| name          | String   | ✅     | trim, minlength: 1                           | Nom du restaurant               |
| address       | String   | Non    | trim                                         | Adresse du restaurant           |
| phone         | String   | Non    | regex: phone (6-20 chars, digits/spaces/+-() | Téléphone du restaurant         |
| opening_hours | String   | Non    | trim                                         | Horaires d'ouverture            |
| createdAt     | Date     | Auto   | -                                            | Date de création (timestamp)    |
| updatedAt     | Date     | Auto   | -                                            | Date de mise à jour (timestamp) |

### Permissions

- **Public :** Lecture (GET)
- **Admin :** Créer, Modifier, Supprimer

### Fonctionnalités

- **Tri :** par nom/adresse (`?sort=name`)
- **Pagination :** `?page=2&limit=10` (limite par défaut = 10)

### Exemples de routes

| Method   | Route              | Access | Description                 |
| -------- | ------------------ | ------ | --------------------------- |
| `GET`    | `/restaurants`     | Public | Lister les restaurants      |
| `POST`   | `/restaurants`     | Admin  | Créer un restaurant         |
| `PUT`    | `/restaurants/:id` | Admin  | Mettre à jour le restaurant |
| `DELETE` | `/restaurants/:id` | Admin  | Supprimer le restaurant     |

---

## 📜 Point de terminaison Menus (`/menus`)

### Modèle Menu

| Champ         | Type     | Requis | Validation                  | Description                     |
| ------------- | -------- | ------ | --------------------------- | ------------------------------- |
| \_id          | ObjectId | Auto   | -                           | Identifiant unique MongoDB      |
| restaurant_id | ObjectId | ✅     | ref: 'Restaurant', required | Référence au restaurant         |
| name          | String   | ✅     | trim, required              | Nom du plat/menu                |
| description   | String   | Non    | trim                        | Description du plat/menu        |
| price         | Number   | ✅     | min: 0, required            | Prix (doit être >= 0)           |
| category      | String   | Non    | trim                        | Catégorie du plat/menu          |
| createdAt     | Date     | Auto   | -                           | Date de création (timestamp)    |
| updatedAt     | Date     | Auto   | -                           | Date de mise à jour (timestamp) |

### Permissions

- **Public :** Lecture
- **Admin :** Créer, Modifier, Supprimer

### Fonctionnalités

- **Tri :** par prix ou catégorie (`?sort=price`)
- **Pagination :** `?page=1&limit=10`

---

## 🛡️ Sécurité

L'application implémente plusieurs couches de sécurité :

### Helmet

- Configure automatiquement les en-têtes HTTP sécurisées
- Protège contre les attaques XSS, clickjacking, etc.

### CORS (Cross-Origin Resource Sharing)

- Configuré via `CORS_ALLOWLIST` dans les variables d'environnement
- Si non défini, autorise toutes les origines
- Si défini, autorise uniquement les origines listées (séparées par des virgules)

### Rate Limiting

- Limite le nombre de requêtes par IP sur une fenêtre de temps configurable
- Configuration via `RATE_LIMIT_WINDOW_MS` (défaut: 15 minutes) et `RATE_LIMIT_MAX` (défaut: 100 requêtes)
- Utilise `express-rate-limit`

### Authentification JWT

- Tokens JWT signés avec une clé secrète
- Middleware d'authentification pour protéger les routes sensibles
- Hachage des mots de passe avec bcrypt (10 rounds)

### Validation des données

- Utilisation de Joi pour valider toutes les entrées utilisateur
- Sanitisation automatique (trim, etc.)

---

## 🩺 Endpoints de santé (`/health`)

### `GET /health`

Vérification de liveness (disponibilité du service).

**Réponse (200) :**

```json
{
  "data": {
    "status": "ok"
  }
}
```

### `GET /health/ready`

Vérification de readiness (connectivité à la base de données).

**Réponse de succès (200) :**

```json
{
  "data": {
    "status": "ready",
    "database": "connected"
  }
}
```

**Réponse d'erreur (503) :**

```json
{
  "error": {
    "message": "Service Unavailable",
    "database": "disconnected"
  }
}
```

---

## 🧪 Tests

Les tests sont une partie essentielle de ce projet.

### Frameworks

- **Tests unitaires :** Jest
- **Tests d'intégration API :** Supertest
- **Configuration :** `jest.config.js` avec `mongodb-memory-server` pour les tests
- **Setup :** `tests/setup.js` pour la configuration globale

### Exemple de test (Supertest)

```js
import request from 'supertest';
import app from '../src/app.js';

describe('GET /restaurants', () => {
  it('should return 200 and list of restaurants', async () => {
    const res = await request(app).get('/restaurants');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
```

Run tests:

```bash
npm test
```

Vérifier la couverture :

```bash
npx nyc npm test
```

---

## 🧾 Documentation API (Swagger / OpenAPI)

La documentation Swagger/OpenAPI est automatiquement générée à partir des commentaires JSDoc dans les fichiers de routes.

### Configuration

- **UI Swagger :** `swagger-ui-express`
- **Spécifications :** `swagger-jsdoc`
- **Fichier de config :** `src/swagger.js`
- **Routes annotées :** Tous les fichiers dans `src/routes/`

### Accès à la documentation

- **Interface utilisateur :** `http://localhost:3000/api-docs`
- **Spécifications JSON :** `http://localhost:3000/api-docs.json`

### Schémas définis

- User
- Restaurant
- Menu
- Error responses (BadRequest, Unauthorized, NotFound, etc.)

---

## 🧩 Validation

Toutes les entrées sont validées en utilisant le middleware **Joi**.

Exemple :

```js
import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});
```

Attacher à la route :

```js
app.post('/users', validate(userSchema), userController.register);
```

---

## 🚀 Déploiement

1. Utilisez **MongoDB Atlas** pour l'hébergement de base de données cloud.
2. Déployez l'API en utilisant :
   - Render
   - Vercel
   - Railway
   - Conteneur Docker

### Exemple de Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
EXPOSE 3000
```

---

## 🧱 Livrables

Soumettre une archive `.zip` contenant :

- Code source complet
- Documentation Swagger/OpenAPI
- `README.md` avec :
  - Installation
  - Instructions d'exécution
  - Exemples d'utilisation de l'API

---

## 📦 Dépendances

### Dépendances de production

- **express** : Framework web pour Node.js
- **mongoose** : ODM pour MongoDB
- **jsonwebtoken** : Génération et validation des JWT
- **bcrypt** : Hachage des mots de passe
- **joi** : Validation des données d'entrée
- **helmet** : Sécurisation des en-têtes HTTP
- **cors** : Gestion Cross-Origin Resource Sharing
- **express-rate-limit** : Limitation du taux de requêtes
- **winston** : Logging structuré
- **morgan** : Logging HTTP des requêtes
- **dotenv** : Gestion des variables d'environnement
- **cross-env** : Variables d'environnement cross-platform

### Dépendances de développement

- **jest** : Framework de test
- **supertest** : Tests d'intégration API
- **mongodb-memory-server** : Base de données MongoDB en mémoire pour les tests
- **swagger-ui-express** + **swagger-jsdoc** : Génération automatique de la documentation API
- **eslint** + **prettier** : Linting et formatage du code
- **husky** + **lint-staged** + **commitlint** : Qualité du code et gestion des commits
- **nodemon** : Redémarrage automatique en développement
- **nyc** : Couverture de code

---

## 📚 Références

- Node.js Documentation — https://nodejs.org/en/docs
- Express.js Guide — https://expressjs.com
- MongoDB Manual — https://www.mongodb.com/docs/
- OpenAPI Specification — https://swagger.io/specification/
- Jest Documentation — https://jestjs.io/
- JWT.io — https://jwt.io
