# 🥡 FoodExpress – Technical Documentation

## 📘 Overview

**FoodExpress** is a backend API project designed for an online food ordering platform.  
The objective is to develop a **RESTful API** using **Node.js** and **Express.js (or Fastify.js)** that handles:

- User management  
- Restaurant registration  
- Menu management  

The API must be **stateless**, **secure (JWT)**, and well-documented (**OpenAPI/Swagger**).

> 🧩 No frontend is required — only the API.

---

## 🏗️ Architecture

### 🔹 Stack

| Layer | Technology |
|-------|-------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose ODM) |
| Authentication | JWT (via Passport.js) |
| Validation | Joi / Yup / AJV |
| Testing | Jest / Mocha + Chai / Supertest |
| Documentation | Swagger / OpenAPI |

---

## 📂 Project Structure

```bash
foodexpress/
│
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── restaurantController.js
│   │   └── menuController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   └── Menu.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── restaurants.js
│   │   └── menus.js
│   ├── utils/
│   │   └── jwt.js
│   ├── app.js                 # Express app
│   └── server.js              # Server entrypoint
│
├── tests/
│   ├── users.test.js
│   ├── restaurants.test.js
│   └── menus.test.js
│
├── package.json
├── .env
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js ≥ 20
- MongoDB or MongoDB Atlas account
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/foodexpress.git
cd foodexpress
npm install
```

### Environment Variables (`.env`)

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/foodexpress
JWT_SECRET=your_secret_key
```

### Run the Server

```bash
npm run dev
```

---

## 🔐 Authentication

JWT-based authentication is used for all protected endpoints.

- **Public routes**:  
  `/restaurants` (GET), `/menus` (GET)

- **Protected routes**:  
  `/users`, `/restaurants` (POST, PUT, DELETE), `/menus` (POST, PUT, DELETE)

### Token Flow

1. User registers or logs in.
2. Server generates a **JWT** using `jsonwebtoken`.
3. Token is sent in headers as `Authorization: Bearer <token>`.
4. Middleware validates the token before processing protected requests.

---

## 👥 Users Endpoint (`/users`)

### Fields

| Field | Type | Required | Description |
|--------|------|-----------|--------------|
| id | ObjectId | Auto | Unique identifier |
| email | String | ✅ | User email |
| username | String | ✅ | Unique username |
| password | String | ✅ | Hashed password |
| role | Enum | default: "user" | Can be "user" or "admin" |

### Permissions

- **Anonymous:** can `POST /users` (register)
- **User:** can update/delete their own account
- **Admin:** full control over users

### Example Routes

| Method | Route | Access | Description |
|---------|-------|---------|-------------|
| `POST` | `/users` | Public | Register a new user |
| `GET` | `/users/:id` | Admin / Self | Get user details |
| `PUT` | `/users/:id` | Auth | Update user |
| `DELETE` | `/users/:id` | Auth | Delete user |

---

## 🍽️ Restaurants Endpoint (`/restaurants`)

### Fields

| Field | Type | Required |
|--------|------|-----------|
| id | ObjectId | Auto |
| name | String | ✅ |
| address | String | ✅ |
| phone | String | ✅ |
| opening_hours | String | ✅ |

### Permissions

- **Public:** Read (GET)
- **Admin:** Create, Update, Delete

### Features

- **Sorting:** by name/address (`?sort=name`)
- **Pagination:** `?page=2&limit=10` (default limit = 10)

### Example Routes

| Method | Route | Access | Description |
|---------|-------|---------|-------------|
| `GET` | `/restaurants` | Public | List restaurants |
| `POST` | `/restaurants` | Admin | Create restaurant |
| `PUT` | `/restaurants/:id` | Admin | Update restaurant |
| `DELETE` | `/restaurants/:id` | Admin | Delete restaurant |

---

## 📜 Menus Endpoint (`/menus`)

### Fields

| Field | Type | Required |
|--------|------|-----------|
| id | ObjectId | Auto |
| restaurant_id | ObjectId | ✅ |
| name | String | ✅ |
| description | String | ✅ |
| price | Number | ✅ |
| category | String | ✅ |

### Permissions

- **Public:** Read
- **Admin:** Create, Update, Delete

### Features

- **Sorting:** by price or category (`?sort=price`)
- **Pagination:** `?page=1&limit=10`

---

## 🧪 Testing

Testing is an essential part of this project.

### Frameworks

- **Unit Tests:** Jest or Mocha  
- **Assertions:** Chai / Jest matchers  
- **API Tests:** Supertest  

### Example Test (Supertest)

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

Check coverage:

```bash
npx nyc npm test
```

---

## 🧾 API Documentation (Swagger / OpenAPI)

Use **Swagger Editor** or **Swagger UI** to visualize your API.

Example setup:

```js
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'FoodExpress API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

Access docs at:  
👉 **`http://localhost:3000/api-docs`**

---

## 🧩 Validation

All inputs are validated using **Joi** middleware.

Example:

```js
import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});
```

Attach to route:

```js
app.post('/users', validate(userSchema), userController.register);
```

---

## 🚀 Deployment

1. Use **MongoDB Atlas** for cloud database hosting.
2. Deploy API using:
   - Render
   - Vercel
   - Railway
   - Docker container

### Example Dockerfile

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

## 🧱 Deliverables

Submit a `.zip` archive containing:

- Full source code
- Swagger/OpenAPI documentation
- `README.md` with:
  - Installation
  - Running instructions
  - Example API usage

---

## 📚 References

- Node.js Documentation — https://nodejs.org/en/docs
- Express.js Guide — https://expressjs.com
- MongoDB Manual — https://www.mongodb.com/docs/
- OpenAPI Specification — https://swagger.io/specification/
- Mocha + Chai + Supertest Docs — https://mochajs.org/
- JWT.io — https://jwt.io
