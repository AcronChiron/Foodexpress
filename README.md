# 🍕 FoodExpress API

> **API REST stateless** avec authentification JWT, Express.js, MongoDB/Mongoose et documentation Swagger/OpenAPI

[![Node.js Version](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.19.1-green.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-9.0.2-red.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-3.0.0-blue.svg)](https://swagger.io/)

## 📋 Description du projet

FoodExpress est une API REST complète pour la gestion de restaurants et de menus. L'API permet aux utilisateurs de s'inscrire, se connecter, et selon leur rôle (utilisateur ou administrateur), d'accéder à différentes fonctionnalités.

### Fonctionnalités principales

- 🔐 **Authentification JWT** : Inscription et connexion sécurisées
- 👥 **Gestion des utilisateurs** : CRUD avec contrôle d'accès basé sur les rôles
- 🏪 **Gestion des restaurants** : Administration complète (admin uniquement)
- 🍽️ **Gestion des menus** : CRUD des menus liés aux restaurants
- 📊 **Pagination et tri** : Support avancé pour les listes
- 🛡️ **Sécurité** : Helmet, CORS, rate limiting, validation Joi
- 📚 **Documentation** : Swagger/OpenAPI interactive
- 🏥 **Monitoring** : Health checks et logs structurés
- ✅ **Tests** : Couverture de 89% avec Jest

## 🚀 Démarrage rapide

### Prérequis

- **Node.js** >= 20.0.0
- **MongoDB** (local ou Atlas)
- **npm** ou **yarn**

### Installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/AcronChiron/3APIS_2025_foodexpress.git
   cd foodexpress
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration de l'environnement**

   Créer un fichier `.env` à la racine du projet :

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/foodexpress
   JWT_SECRET=votre_cle_secrete_jwt_tres_longue_et_complexe
   NODE_ENV=development
   ```

   > ⚠️ **Important** : Remplacez `votre_cle_secrete_jwt_tres_longue_et_complexe` par une clé secrète forte en production.

4. **Démarrer MongoDB**

   Assurez-vous que MongoDB est en cours d'exécution sur votre machine ou configurez une connexion Atlas.

5. **Lancer l'application**

   ```bash
   # Mode développement (avec nodemon)
   npm run dev

   # Mode production
   npm run start
   ```

6. **Vérifier le fonctionnement**

   Ouvrez votre navigateur et allez sur :
   - **API** : http://localhost:3000
   - **Documentation Swagger** : http://localhost:3000/api-docs
   - **Health Check** : http://localhost:3000/health

## 📖 Utilisation de l'API

### Authentification

#### Inscription d'un utilisateur

```bash
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "monusername",
  "password": "motdepasse123"
}
```

#### Connexion

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponse** :

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64f...",
      "email": "user@example.com",
      "username": "monusername",
      "role": "user"
    }
  }
}
```

### Endpoints principaux

#### Utilisateurs (`/users`)

- `POST /users` - Inscription (public)
- `GET /users/:id` - Profil utilisateur (self ou admin)
- `PUT /users/:id` - Mise à jour (self ou admin)
- `DELETE /users/:id` - Suppression (self ou admin)

#### Restaurants (`/restaurants`)

- `GET /restaurants` - Liste avec pagination/tri (public)
- `POST /restaurants` - Création (admin uniquement)
- `PUT /restaurants/:id` - Mise à jour (admin uniquement)
- `DELETE /restaurants/:id` - Suppression (admin uniquement)

#### Menus (`/menus`)

- `GET /menus` - Liste avec pagination/tri (public)
- `POST /menus` - Création (admin uniquement)
- `PUT /menus/:id` - Mise à jour (admin uniquement)
- `DELETE /menus/:id` - Suppression (admin uniquement)

#### Monitoring (`/health`)

- `GET /health` - Health check (liveness)
- `GET /health/ready` - Readiness check (base de données)

### Exemples d'utilisation avec cURL

#### Créer un restaurant (Admin)

```bash
curl -X POST http://localhost:3000/restaurants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chez Giovanni",
    "address": "123 Rue de la Paix, Paris",
    "phone": "+33123456789",
    "opening_hours": "Lundi-Dimanche: 11h-23h"
  }'
```

#### Lister les menus avec pagination

```bash
curl "http://localhost:3000/menus?page=1&limit=10&sort=price"
```

## 🧪 Tests

### Exécution des tests

```bash
# Tous les tests
npm test

# Tests avec couverture
npm run coverage

# Tests en mode watch
npm run test -- --watch
```

### Structure des tests

- **Tests d'intégration** avec Supertest
- **Mock de base de données** avec mongodb-memory-server
- **Couverture de code** > 80%
- **Tests de sécurité** (authentification, autorisation)

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev          # Démarrage avec nodemon
npm run start        # Démarrage en production

# Qualité du code
npm run lint         # Vérification ESLint
npm run format       # Formatage Prettier

# Tests
npm test             # Exécution des tests
npm run coverage     # Tests avec couverture

# Base de données
npm run seed         # Peuplement de la base (dev/test)
npm run wipe         # Vidage des collections (dev/test)
```

## 🏗️ Architecture

```
src/
├── app.js              # Configuration Express
├── server.js           # Point d'entrée serveur
├── config/
│   ├── mongodb.js      # Connexion MongoDB
│   └── security.js     # Sécurité (CORS, rate limiting)
├── controllers/        # Logique métier
│   ├── userController.js
│   ├── restaurantController.js
│   └── menuController.js
├── middleware/         # Middlewares personnalisés
│   ├── auth.js         # Authentification JWT
│   ├── authorize.js    # Autorisation RBAC
│   ├── validation.js   # Validation Joi
│   └── errorHandler.js # Gestion d'erreurs
├── models/             # Schémas Mongoose
│   ├── User.js
│   ├── Restaurant.js
│   └── Menu.js
├── routes/             # Définition des routes
│   ├── users.js
│   ├── restaurants.js
│   ├── menus.js
│   └── auth.js
├── utils/              # Utilitaires
│   ├── jwt.js          # Gestion JWT
│   ├── logger.js       # Logging Winston
│   └── pagination.js   # Pagination/tri
└── swagger.js          # Configuration Swagger
```

## 🔒 Sécurité

### Authentification

- **JWT (JSON Web Tokens)** avec expiration
- **Hashage des mots de passe** avec bcrypt
- **Middleware d'authentification** obligatoire pour les routes protégées

### Autorisation (RBAC)

- **Rôles utilisateur** : `user` (par défaut), `admin`
- **Contrôle d'accès** :
  - Utilisateurs : accès self uniquement (sauf admin)
  - Restaurants/Menus : lecture publique, écriture admin uniquement

### Sécurité applicative

- **Helmet.js** : Headers de sécurité HTTP
- **CORS** : Configuration flexible des origines
- **Rate Limiting** : Protection contre les abus
- **Validation Joi** : Validation stricte des entrées
- **Logs structurés** : Traçabilité des actions

## 📊 Base de données

### Modèles

#### User

```javascript
{
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashé
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}
```

#### Restaurant

```javascript
{
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  opening_hours: { type: String }
}
```

#### Menu

```javascript
{
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  category: { type: String }
}
```

### Indexes

- `email` et `username` uniques sur User
- Index sur `restaurant_id` pour les menus

## 📚 Documentation API

La documentation complète de l'API est disponible via Swagger UI :

**http://localhost:3000/api-docs**

### Fonctionnalités de la documentation

- 📋 **Descriptions détaillées** de tous les endpoints
- 🔐 **Authentification JWT** intégrée
- 📝 **Exemples de requêtes** cURL
- 📊 **Schémas de données** complets
- ⚠️ **Codes d'erreur** documentés

## 🔧 Configuration avancée

### Variables d'environnement

| Variable         | Description              | Défaut        | Obligatoire |
| ---------------- | ------------------------ | ------------- | ----------- |
| `PORT`           | Port du serveur          | `3000`        | Non         |
| `MONGO_URI`      | URI MongoDB              | -             | Oui         |
| `JWT_SECRET`     | Clé secrète JWT          | -             | Oui         |
| `NODE_ENV`       | Environnement            | `development` | Non         |
| `CORS_ALLOWLIST` | Origines CORS (virgules) | Toutes        | Non         |
| `LOG_LEVEL`      | Niveau de logs           | `info`        | Non         |

### Rate Limiting

- **100 requêtes** par fenêtre de 15 minutes par IP
- Configurable dans `src/config/security.js`

### Logs

- **Console** et **fichiers** (`logs/error.log`, `logs/all.log`)
- Niveaux : `error`, `warn`, `info`, `http`, `debug`
- Format structuré avec timestamps

## 🚀 Déploiement

### Préparation pour la production

1. **Variables d'environnement**

   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/foodexpress_prod
   JWT_SECRET=une_cle_tres_longue_et_complexe_pour_la_prod
   PORT=3000
   ```

2. **Build et déploiement**

   ```bash
   npm ci --only=production
   npm run start
   ```

3. **Health Checks**
   - **Liveness** : `GET /health`
   - **Readiness** : `GET /health/ready`

### Services de déploiement recommandés

- **Railway**
- **Render**
- **Heroku**
- **Vercel** (avec adaptation)
- **Docker** (avec MongoDB séparé)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- **ESLint** et **Prettier** configurés
- **Tests** requis pour toute nouvelle fonctionnalité
- **Documentation** à jour
- **Commits** conventionnels

## 📝 Licence

Ce projet est sous licence **ISC**.

## 👥 Auteurs

- **Nicolas Valerino** - Développement
- **Nicolas Baylac** - Développement

## 🙏 Remerciements

- **Express.js** - Framework web
- **MongoDB/Mongoose** - Base de données
- **JWT.io** - Authentification
- **Swagger/OpenAPI** - Documentation
- **Jest** - Tests

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**
