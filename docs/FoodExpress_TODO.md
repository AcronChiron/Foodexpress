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
- [ ] `config/db.js` : connecter Mongoose + gestion des événements & retries
- [x] Sanity route `GET /health` → `{status:"ok"}`
- [ ] Linter & Prettier configurés (pre-commit hook avec Husky facultatif)

---

## 2) Modèles Mongoose (jour 1)

- [ ] `User` : `{ email, username, password(hash), role: "user"|"admin" }` (indexes uniques email/username)
- [ ] `Restaurant` : `{ name, address, phone, opening_hours }`
- [ ] `Menu` : `{ restaurant_id(ref), name, description, price, category }`
- [ ] Hooks/validators Mongoose (ex: prix ≥ 0), timestamps

---

## 3) Auth & sécurité (jour 2)

- [ ] Inscription publique `POST /users` (hash `bcrypt`, validation Joi)
- [ ] Connexion `POST /auth/login` (retour token JWT signé)
- [ ] Middleware `authMiddleware` :
  - [ ] Vérifie `Authorization: Bearer <token>`
  - [ ] Expose `req.user` (id, role)
- [ ] Utils `utils/jwt.js` (`sign`, `verify`, durée token)
- [ ] Règles d’accès (RBAC):
  - [ ] utilisateurs: modif/suppression **seulement soi-même**
  - [ ] admin: plein contrôle users + CUD restaurants/menus
- [ ] Durcissement: Helmet, CORS (origin list), rate limit (facultatif)

---

## 4) Routes & contrôleurs (jours 2–3)

### `/users`

- [ ] `POST /users` — créer **(public)**
- [ ] `GET /users/:id` — **self** ou **admin**
- [ ] `PUT /users/:id` — **self** ou **admin**
- [ ] `DELETE /users/:id` — **self** ou **admin**

### `/restaurants`

- [ ] `GET /restaurants` — public (tri/pagination: `?sort=name&page=1&limit=10`)
- [ ] `POST /restaurants` — **admin**
- [ ] `PUT /restaurants/:id` — **admin**
- [ ] `DELETE /restaurants/:id` — **admin**

### `/menus`

- [ ] `GET /menus` — public (tri/pagination: `?sort=price&page=1&limit=10`)
- [ ] `POST /menus` — **admin**
- [ ] `PUT /menus/:id` — **admin**
- [ ] `DELETE /menus/:id` — **admin**

---

## 5) Validation & gestion d’erreurs (jour 3)

- [ ] Schémas Joi par ressource (create/update)
- [ ] `validationMiddleware(schema)` branché sur routes
- [ ] Map d’erreurs → codes HTTP cohérents (400/401/403/404/409/422/500)
- [ ] Réponses JSON uniformes (`{data|error, meta}`)

---

## 6) Pagination/tri/filtrage (jour 3)

- [ ] Utilitaires communs (`getPagination`, `getSort`, `getFilters`)
- [ ] Ajouter `X-Total-Count` et `meta: {page, limit, total}`

---

## 7) Tests (jours 3–4)

- [ ] Setup test runner (Jest **ou** Mocha+Chai)
- [ ] Tests d’intégration Supertest:
  - [ ] `GET /restaurants` (200, tableau)
  - [ ] Auth requise pour CUD (`401/403`)
  - [ ] Rôles (admin vs user)
  - [ ] Users: self-update/delete et interdictions
  - [ ] Menus: tri par `price`, pagination
- [ ] Couverture (`nyc`) ≥ **80%** lignes/fonctions/branches
- [ ] Mock DB (si besoin) **ou** base Mongo test dédiée
- [ ] Seeds de test (fixtures) minimales

---

## 8) Documentation OpenAPI (jour 4)

- [ ] `swagger-jsdoc` + `swagger-ui-express` (`/api-docs`)
- [ ] Décrire schémas, security schemes (JWT), réponses d’erreur
- [ ] Exemple de requêtes & `curl` dans la doc
- [ ] Vérifier que toutes les routes exposées sont documentées

---

## 9) DX/CI & qualité

- [ ] ESLint + Prettier + `npm run lint` (CI bloque en cas d’erreur)
- [ ] GitHub Actions: lint + tests + rapport de couverture
- [ ] Commit lint (facultatif) + Conventional Commits
- [ ] Logger HTTP (`morgan`) et logger d’app (pino/winston) (facultatif)

---

## 10) Données & seed

- [ ] Script seed: créer 1 admin, 2 users, 3 restaurants, quelques menus
- [ ] Script wipe: vider collections (environnement **dev/test** uniquement)

---

## 11) Déploiement

- [ ] Dockerfile (alpine), .dockerignore
- [ ] Variables env prod (JWT_SECRET fort, MONGO_URI Atlas)
- [ ] Healthcheck, readiness, logs
- [ ] Hébergement: Render/Vercel/Railway (ou VM) + MongoDB Atlas

---

## 12) Postman/Insomnia

- [ ] Créer collection avec exemples (public & Auth) et partager/exporter

---

## 13) Definition of Done (par fonctionnalité)

- [ ] Code + tests verts (≥80% cov) + lint ok
- [ ] Validation & erreurs gérées
- [ ] RBAC respecté
- [ ] Swagger à jour
- [ ] Revue PR + CI verte

---

## À vérifier dans **Day 4** (début de projet fourni)

- [ ] Présence de l’app Express + route de test
- [ ] Connexion Mongo (Mongoose) opérationnelle
- [ ] Squelettes de routes `/users`, `/restaurants`, `/menus`
- [ ] Middleware d’auth (JWT) présent ou à créer
- [ ] Fichiers env/README de démarrage

---

## Backlog (options)

- [ ] Rate limiting (express-rate-limit)
- [ ] ETag/Cache-Control pour GET publics
- [ ] Soft-delete ou audit trail
- [ ] i18n des messages d’erreur
- [ ] WebSocket (notifications live) si besoin futur
