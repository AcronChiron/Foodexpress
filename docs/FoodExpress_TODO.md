# ✅ TODO — FoodExpress (API Node.js/Express/MongoDB)

> Projet: **FoodExpress** — API REST stateless avec **JWT**, **Express.js**, **MongoDB/Mongoose**, **Swagger/OpenAPI**  
> Portée: `/users`, `/restaurants`, `/menus` — R/W selon rôles

---

## 0) Démarrage & métas (jour 0)

- [x] Créer le repo / activer Issues & Projects (Kanban)
- [x] Initialiser projet : `npm init -y` (Node ≥ 20)
- [x] Ajouter scripts npm (`dev`, `start`, `test`, `lint`, `coverage`)
- [x] Installer deps: `express`, `mongoose`, `jsonwebtoken`, `bcrypt`, `joi` (ou `ajv`), `cors`, `helmet`, `morgan`, `dotenv`
- [x] Installer dev deps: `nodemon`, `jest` _ou_ `mocha` + `chai`, `supertest`, `nyc`, `eslint`, `prettier`
- [x] Arborescence (selon la doc):
  ```
  src/
    config/db.js
    controllers/{user,restaurant,menu}Controller.js
    middleware/{auth,validation}.js
    models/{User,Restaurant,Menu}.js
    routes/{users,restaurants,menus}.js
    utils/jwt.js
    app.js
    server.js
  tests/{users,restaurants,menus}.test.js
  ```
- [x] Fichier `.env` (exemple)
  ```env
  PORT=3000
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/foodexpress
  JWT_SECRET=your_secret_key
  ```

---

## 1) Base serveur & DB (jour 1)

- [x] `app.js` : créer l’app Express (JSON, CORS, Helmet, logger, handler 404/erreurs)
- [x] `server.js` : démarrer sur `process.env.PORT`
- [x] `config/db.js` : connecter Mongoose + gestion des événements & retries
- [x] Sanity route `GET /health` → `{status:"ok"}`
- [x] Linter & Prettier configurés (pre-commit hook avec Husky facultatif)

---

## 2) Modèles Mongoose (jour 1)

- [x] `User` : `{ email, username, password(hash), role: "user"|"admin" }` (indexes uniques email/username)
- [x] `Restaurant` : `{ name, address, phone, opening_hours }`
- [x] `Menu` : `{ restaurant_id(ref), name, description, price, category }`
- [x] Hooks/validators Mongoose (ex: prix ≥ 0), timestamps

---

## 3) Auth & sécurité (jour 2)

- [x] Inscription publique `POST /users` (hash `bcrypt`, validation Joi)
- [x] Connexion `POST /auth/login` (retour token JWT signé)
- [x] Middleware `authMiddleware` :
  - [x] Vérifie `Authorization: Bearer <token>`
  - [x] Expose `req.user` (id, role)
- [x] Utils `utils/jwt.js` (`sign`, `verify`, durée token)
- [x] Règles d’accès (RBAC):
  - [x] utilisateurs: modif/suppression **seulement soi-même**
  - [x] admin: plein contrôle users + CUD restaurants/menus
- [x] Durcissement: Helmet, CORS (origin list), rate limit (facultatif)

---

## 4) Routes & contrôleurs (jours 2–3)

### `/users`

- [x] `POST /users` — créer **(public)**
- [x] `GET /users/:id` — **self** ou **admin**
- [x] `PUT /users/:id` — **self** ou **admin**
- [x] `DELETE /users/:id` — **self** ou **admin**

### `/restaurants`

- [x] `GET /restaurants` — public (tri/pagination: `?sort=name&page=1&limit=10`)
- [x] `POST /restaurants` — **admin**
- [x] `PUT /restaurants/:id` — **admin**
- [x] `DELETE /restaurants/:id` — **admin**

### `/menus`

- [x] `GET /menus` — public (tri/pagination: `?sort=price&page=1&limit=10`)
- [x] `POST /menus` — **admin**
- [x] `PUT /menus/:id` — **admin**
- [x] `DELETE /menus/:id` — **admin**

---

## 5) Validation & gestion d’erreurs (jour 3)

- [x] Schémas Joi par ressource (create/update)
- [x] `validationMiddleware(schema)` branché sur routes
- [x] Map d’erreurs → codes HTTP cohérents (400/401/403/404/409/422/500)
- [x] Réponses JSON uniformes (`{data|error, meta}`)

---

## 6) Pagination/tri/filtrage (jour 3)

- [x] Utilitaires communs (`getPagination`, `getSort`, `getFilters`)
- [x] Ajouter `X-Total-Count` et `meta: {page, limit, total}`

---

## 7) Tests (jours 3–4)

- [x] Setup test runner (Jest **ou** Mocha+Chai)
- [x] Tests d’intégration Supertest:
  - [x] `GET /restaurants` (200, tableau)
  - [x] Auth requise pour CUD (`401/403`)
  - [x] Rôles (admin vs user)
  - [x] Users: self-update/delete et interdictions
  - [x] Menus: tri par `price`, pagination
- [x] Couverture (`nyc`) = **100%** lignes/fonctions/branches
- [x] Mock DB (si besoin) **ou** base Mongo test dédiée
- [x] Seeds de test (fixtures) minimales

---

## 8) Documentation OpenAPI (jour 4)

- [x] `swagger-jsdoc` + `swagger-ui-express` (`/api-docs`)
- [x] Décrire schémas, security schemes (JWT), réponses d’erreur
- [x] Exemple de requêtes & `curl` dans la doc
- [x] Vérifier que toutes les routes exposées sont documentées

---

## 10) Données & seed

- [x] Script seed: créer 1 admin, 2 users, 3 restaurants, quelques menus
- [x] Script wipe: vider collections (environnement **dev/test** uniquement)

---

## 11) Déploiement

- [x] Variables env prod (JWT_SECRET fort, MONGO_URI Atlas)
- [x] Healthcheck, readiness, logs

---

## 12) Insomnia

- [x] Créer collection avec exemples (public & Auth) et partager/exporter

---

## 13) Definition of Done (par fonctionnalité)

- [x] Code + tests verts (>=80% cov) + lint ok
- [x] Validation & erreurs gérées
- [x] RBAC respecté
- [x] Swagger à jour

---

## À vérifier dans **Day 4** (début de projet fourni)

- [x] Présence de l’app Express + route de test
- [x] Connexion Mongo (Mongoose) opérationnelle
- [x] Squelettes de routes `/users`, `/restaurants`, `/menus`
- [x] Middleware d’auth (JWT) présent ou à créer
- [x] Fichiers env/README de démarrage
