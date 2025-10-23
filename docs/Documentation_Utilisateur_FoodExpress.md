# 📚 Documentation Utilisateur - FoodExpress API

## 🏠 Introduction et Vue d'ensemble

Bienvenue dans la documentation utilisateur de **FoodExpress**, une API RESTful moderne conçue pour faciliter la gestion des commandes de nourriture en ligne. Cette API permet aux utilisateurs de s'inscrire, de se connecter, et d'accéder aux informations sur les restaurants et leurs menus.

### 🎯 Objectif de l'API

FoodExpress fournit une interface programmatique pour :

- Gérer les comptes utilisateurs
- Consulter les restaurants disponibles
- Explorer les menus et leurs détails
- Intégrer facilement avec des applications de commande de nourriture

### 🔧 Architecture

L'API est construite avec :

- **Backend** : Node.js avec Express.js
- **Base de données** : MongoDB via Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **Documentation** : OpenAPI/Swagger
- **Sécurité** : HTTPS, rate limiting, CORS

### 🌐 Accès à l'API

- **URL de base** : `https://your-api-domain.com` (à remplacer par votre domaine)
- **Version** : v1.0.0
- **Format des données** : JSON
- **Encodage** : UTF-8

---

## 🔐 Guide d'Authentification

### 📝 Inscription d'un nouvel utilisateur

Pour utiliser l'API, vous devez d'abord créer un compte utilisateur.

**Endpoint :** `POST /users`

**En-têtes requis :**

```
Content-Type: application/json
```

**Corps de la requête :**

```json
{
  "email": "votre.email@example.com",
  "username": "votrenomutilisateur",
  "password": "votremotdepasse"
}
```

**Exemple de réponse (201 Created) :**

```json
{
  "data": {
    "_id": "64b...",
    "email": "votre.email@example.com",
    "username": "votrenomutilisateur",
    "role": "user",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 🚪 Connexion

Une fois inscrit, connectez-vous pour obtenir un token JWT.

**Endpoint :** `POST /auth/login`

**En-têtes requis :**

```
Content-Type: application/json
```

**Corps de la requête :**

```json
{
  "email": "votre.email@example.com",
  "password": "votremotdepasse"
}
```

**Exemple de réponse (200 OK) :**

```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64b...",
      "email": "votre.email@example.com",
      "username": "votrenomutilisateur",
      "role": "user"
    }
  }
}
```

### 🔑 Utilisation du Token JWT

Pour les endpoints protégés, incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important :** Le token expire après un certain temps. Si vous recevez une erreur 401, reconnectez-vous.

---

## 👥 Gestion des Utilisateurs

### 📋 Récupérer les informations d'un utilisateur

**Endpoint :** `GET /users/{id}`

**Authentification :** Requise (utilisateur lui-même ou administrateur)

**Paramètres :**

- `id` (path) : ID de l'utilisateur

**Exemple de réponse (200 OK) :**

```json
{
  "data": {
    "_id": "64b...",
    "email": "votre.email@example.com",
    "username": "votrenomutilisateur",
    "role": "user",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### ✏️ Modifier un utilisateur

**Endpoint :** `PUT /users/{id}`

**Authentification :** Requise (utilisateur lui-même ou administrateur)

**Paramètres :**

- `id` (path) : ID de l'utilisateur

**Corps de la requête :**

```json
{
  "email": "nouveau.email@example.com",
  "username": "nouveaunom"
}
```

### 🗑️ Supprimer un utilisateur

**Endpoint :** `DELETE /users/{id}`

**Authentification :** Requise (utilisateur lui-même ou administrateur)

**Paramètres :**

- `id` (path) : ID de l'utilisateur

**Réponse :** 204 No Content

---

## 🍽️ Gestion des Restaurants

### 📋 Lister tous les restaurants

**Endpoint :** `GET /restaurants`

**Authentification :** Non requise

**Paramètres de requête optionnels :**

- `page` (integer, défaut: 1) : Numéro de page
- `limit` (integer, défaut: 10) : Nombre d'éléments par page
- `q` (string) : Recherche par nom ou adresse
- `name` (string) : Filtrer par nom
- `sort` (string) : Tri par champ (ex: "name", "-name")

**Exemple de réponse (200 OK) :**

```json
{
  "data": [
    {
      "_id": "64c...",
      "name": "Chez Marie",
      "address": "123 Rue de la Paix, Paris",
      "phone": "+33123456789",
      "opening_hours": "Lundi-Dimanche: 11h-23h",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

### 🔍 Consulter un restaurant spécifique

**Endpoint :** `GET /restaurants/{id}`

**Authentification :** Non requise

**Paramètres :**

- `id` (path) : ID du restaurant

### 🆕 Créer un restaurant (Administrateur seulement)

**Endpoint :** `POST /restaurants`

**Authentification :** Requise (administrateur)

**Corps de la requête :**

```json
{
  "name": "Nouveau Restaurant",
  "address": "456 Avenue des Champs, Lyon",
  "phone": "+33498765432",
  "opening_hours": "Lundi-Samedi: 12h-14h, 19h-22h"
}
```

### ✏️ Modifier un restaurant (Administrateur seulement)

**Endpoint :** `PUT /restaurants/{id}`

**Authentification :** Requise (administrateur)

**Paramètres :**

- `id` (path) : ID du restaurant

### 🗑️ Supprimer un restaurant (Administrateur seulement)

**Endpoint :** `DELETE /restaurants/{id}`

**Authentification :** Requise (administrateur)

---

## 📜 Gestion des Menus

### 📋 Lister tous les menus

**Endpoint :** `GET /menus`

**Authentification :** Non requise

**Paramètres de requête optionnels :**

- `restaurant_id` (string) : ID du restaurant
- `category` (string) : Catégorie du menu
- `price_min` (number) : Prix minimum
- `price_max` (number) : Prix maximum
- `page` (integer, défaut: 1) : Numéro de page
- `limit` (integer, défaut: 10) : Nombre d'éléments par page
- `sort` (string) : Tri par champ (ex: "price", "-price")
- `q` (string) : Recherche textuelle

**Exemple de réponse (200 OK) :**

```json
{
  "data": [
    {
      "_id": "64d...",
      "restaurant_id": "64c...",
      "name": "Pizza Margherita",
      "description": "Tomate, mozzarella, basilic",
      "price": 12.5,
      "category": "Pizza",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### 🔍 Consulter un menu spécifique

**Endpoint :** `GET /menus/{id}`

**Authentification :** Non requise

**Paramètres :**

- `id` (path) : ID du menu

### 🆕 Créer un menu (Administrateur seulement)

**Endpoint :** `POST /menus`

**Authentification :** Requise (administrateur)

**Corps de la requête :**

```json
{
  "restaurant_id": "64c...",
  "name": "Burger Deluxe",
  "description": "Burger avec frites et boisson",
  "price": 15.99,
  "category": "Burger"
}
```

### ✏️ Modifier un menu (Administrateur seulement)

**Endpoint :** `PUT /menus/{id}`

**Authentification :** Requise (administrateur)

**Paramètres :**

- `id` (path) : ID du menu

### 🗑️ Supprimer un menu (Administrateur seulement)

**Endpoint :** `DELETE /menus/{id}`

**Authentification :** Requise (administrateur)

---

## ⚠️ Gestion des Erreurs

### Codes d'erreur courants

| Code | Signification         | Description                               |
| ---- | --------------------- | ----------------------------------------- |
| 200  | OK                    | Requête réussie                           |
| 201  | Created               | Ressource créée                           |
| 204  | No Content            | Requête réussie, pas de contenu           |
| 400  | Bad Request           | Requête malformée ou paramètres invalides |
| 401  | Unauthorized          | Token manquant, invalide ou expiré        |
| 403  | Forbidden             | Permissions insuffisantes                 |
| 404  | Not Found             | Ressource non trouvée                     |
| 409  | Conflict              | Conflit (email ou username déjà utilisé)  |
| 422  | Unprocessable Entity  | Données invalides côté serveur            |
| 429  | Too Many Requests     | Limite de taux dépassée                   |
| 500  | Internal Server Error | Erreur serveur                            |

### Structure des erreurs

Toutes les erreurs suivent ce format :

```json
{
  "error": {
    "message": "Description de l'erreur",
    "details": [
      {
        "message": "Champ requis manquant",
        "path": "email"
      }
    ]
  }
}
```

### Erreurs courantes et solutions

- **401 Unauthorized** : Vérifiez que votre token JWT est valide et inclus dans l'en-tête Authorization
- **404 Not Found** : Vérifiez que l'ID de la ressource est correct
- **409 Conflict** : L'email ou le nom d'utilisateur est déjà utilisé
- **422 Unprocessable Entity** : Les données envoyées ne respectent pas les règles de validation
- **429 Too Many Requests** : Attendez avant de faire de nouvelles requêtes

---

## 🛡️ Limitation du Taux de Requêtes (Rate Limiting)

L'API applique une limitation du taux pour prévenir les abus :

- **Limite par défaut** : 100 requêtes par fenêtre de 15 minutes par adresse IP
- **En-têtes de réponse** :
  - `X-RateLimit-Limit` : Nombre maximum de requêtes
  - `X-RateLimit-Remaining` : Requêtes restantes
  - `X-RateLimit-Reset` : Timestamp de réinitialisation

Si vous dépassez la limite, vous recevrez une erreur 429 avec un message d'attente.

---

## 💡 Bonnes Pratiques d'Intégration

### 🔧 Gestion des Tokens

1. **Stockage sécurisé** : Ne stockez jamais les tokens en clair dans le code
2. **Expiration** : Gérez l'expiration des tokens et reconnectez automatiquement
3. **Actualisation** : Préparez-vous à gérer la reconnexion quand le token expire

### 📊 Pagination

1. **Utilisez la pagination** pour les listes importantes
2. **Début par la page 1** (comportement par défaut)
3. **Limite raisonnable** : 10-50 éléments par page selon vos besoins

### 🔍 Gestion des Erreurs

1. **Vérifiez toujours le code de statut** avant de traiter la réponse
2. **Gérez les erreurs 401** en reconnectant l'utilisateur
3. **Implémentez un retry** pour les erreurs temporaires (5xx)

### 🚀 Optimisations

1. **Cache les données statiques** comme les restaurants et menus
2. **Utilisez les filtres** pour réduire la quantité de données transférées
3. **Batch les requêtes** quand possible
4. **Surveillez les limites de taux** et adaptez votre fréquence de requêtes

### 📱 Considérations Mobile

1. **Taille des payloads** : Optimisez pour les connexions mobiles
2. **Gestion hors ligne** : Cachez les données importantes
3. **Sync périodique** : Actualisez les données régulièrement

---

## 🔧 Dépannage

### Problèmes courants et solutions

#### "401 Unauthorized" lors de l'utilisation du token

- Vérifiez que le token est inclus dans l'en-tête `Authorization: Bearer <token>`
- Assurez-vous que le token n'a pas expiré
- Vérifiez que le token n'est pas corrompu

#### "404 Not Found" pour une ressource valide

- Vérifiez que l'ID est correct (format ObjectId MongoDB)
- Confirmez que la ressource n'a pas été supprimée
- Vérifiez que vous utilisez la bonne route

#### "409 Conflict" lors de la création

- L'email ou le nom d'utilisateur est déjà utilisé
- Essayez un autre email ou nom d'utilisateur

#### "422 Unprocessable Entity"

- Les données envoyées ne respectent pas la validation
- Vérifiez les champs requis et les formats
- Consultez la section validation dans la réponse d'erreur

#### "429 Too Many Requests"

- Vous avez dépassé la limite de taux
- Attendez la réinitialisation de la fenêtre (15 minutes par défaut)
- Réduisez la fréquence de vos requêtes

#### Erreurs de connexion

- Vérifiez l'URL de base de l'API
- Assurez-vous que l'API est accessible (pas de problème réseau)
- Vérifiez que vous utilisez HTTPS

#### Problèmes de CORS

- L'API peut être configurée pour accepter seulement certains domaines
- Contactez l'administrateur si vous développez depuis un domaine non autorisé

### Outils de débogage

- **Postman** ou **Insomnia** pour tester les endpoints
- **Console développeur** du navigateur pour les requêtes AJAX
- **Logs de l'application** pour diagnostiquer les erreurs côté serveur

### Support et contact

Si vous rencontrez des problèmes non couverts ici :

1. Consultez la documentation technique complète
2. Vérifiez les logs de votre application
3. Contactez l'équipe de développement avec :
   - Description du problème
   - Requête exacte effectuée
   - Réponse reçue
   - Environnement (OS, navigateur, etc.)

---

## 📋 Exemples d'Utilisation

### 🔄 Flux complet d'utilisation

1. **Inscription** : Créer un compte utilisateur
2. **Connexion** : Obtenir un token JWT
3. **Explorer** : Lister les restaurants disponibles
4. **Découvrir** : Consulter les menus d'un restaurant
5. **Intégrer** : Utiliser les données dans votre application

### 💻 Exemple en JavaScript (Fetch API)

```javascript
// Connexion
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data.data.token;
};

// Utilisation d'un endpoint protégé
const getUserProfile = async (token, userId) => {
  const response = await fetch(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
```

### 🐍 Exemple en Python (requests)

```python
import requests

# Connexion
def login(email, password):
    response = requests.post('/auth/login', json={
        'email': email,
        'password': password
    })
    return response.json()['data']['token']

# Lister les restaurants
def get_restaurants(token, page=1, limit=10):
    headers = {'Authorization': f'Bearer {token}'}
    params = {'page': page, 'limit': limit}
    response = requests.get('/restaurants', headers=headers, params=params)
    return response.json()
```

---

## 📞 Points de Terminaison de Santé (Health Checks)

### Vérification de santé générale

**Endpoint :** `GET /health`

**Authentification :** Non requise

**Réponse :**

```json
{
  "data": {
    "status": "ok"
  }
}
```

### Vérification de préparation (avec base de données)

**Endpoint :** `GET /health/ready`

**Authentification :** Non requise

**Réponse :**

```json
{
  "data": {
    "status": "ready",
    "database": "connected"
  }
}
```

---

## 🔗 Liens Utiles

- [Documentation Technique Complète](FoodExpress_Documentation.md)
- [Collection Insomnia/Postman](FoodExpress_Insomnia_Collection.json)
- [Spécifications OpenAPI](http://localhost:3000/api-docs.json)
- [Interface Swagger UI](http://localhost:3000/api-docs)

---

_Cette documentation est maintenue à jour avec les dernières fonctionnalités de l'API FoodExpress. Pour toute question ou suggestion d'amélioration, contactez l'équipe de développement._
