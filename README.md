# E-Commerce Backend (Ready)

A backend-ready e-commerce project built with Node.js and Express. This repository provides RESTful APIs for products, cart, checkout, orders, users, admin operations, and file uploads. It includes controllers, models, routes, and DB configuration so you can connect a frontend (React, Vue, etc.) or use it as a starting point for a full-stack app.

## Features
- RESTful API structure with clear separation of controllers, models, and routes
- Product, cart, checkout, order and user management
- File upload support (for product images)
- Database seeder to populate initial data
- Simple auth middleware scaffolding for protected routes

## Folder structure

Project root:

```
package.json
seeder.js
server.js
config/
  db.js
controllers/
  admin.controller.js
  cart.controller.js
  checkout.controller.js
  orders.controller.js
  product.controller.js
  user.controller.js
data/
  products.js
middlewares/
  authMiddleware.js
models/
  cart.model.js
  checkout.model.js
  order.model.js
  product.model.js
  user.model.js
routes/
  admin.routes.js
  cart.routes.js
  checkout.routes.js
  order.routes.js
  product.routes.js
  upload.routes.js
  user.routes.js
```

Refer to the `controllers`, `models`, and `routes` directories for the API implementation and to `config/db.js` for database connection details.

## Technologies
- Node.js
- Express
- MongoDB (or any database configured in `config/db.js`)
- Mongoose (likely used for models)
- Multer (for file uploads — see `routes/upload.routes.js`)

## Prerequisites
- Node.js 14+ or newer
- npm or yarn
- A running MongoDB instance (local or cloud)

## Setup

1. Clone the repo and change into the project directory:

```bash
git clone https://github.com/mad-guitaristJD/E-commerce.git
cd E-commerce
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

- Create a `.env` file in the project root or export environment variables 
```
PORT=3000
DATABASE_URI="mongodb://127.0.0.1:27017/e-commerce"
JWT_SECRET_KEY=anyrandomkeywouldhere67
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

4. Seed the database (optional):

```bash
npm run seed
```

5. Start the server:

```bash
node server.js
# OR
npm run dev
```


Happy building!
