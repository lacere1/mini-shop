# MiniShop

MiniShop is a small e-commerce platform built with a microservices architecture. The project is meant to demonstrate how a simple online store can be broken into independent services and stitched together with an API gateway.

---

## Features Implemented

- **Authentication service**  
  - User registration and login  
  - JWT-based authentication  
  - Backed by Postgres database  

- **Catalog service**  
  - Returns a list of products (currently in-memory)  
  - Health check endpoint  

- **API Gateway**  
  - Central entry point  
  - Proxies requests to catalog and auth services  

- **Web frontend**  
  - Built with Next.js and Tailwind CSS  
  - Basic storefront UI to browse products  

- **Admin**  
  - Admin panel in place for future product management  

---

## Tech Stack

- [NestJS](https://nestjs.com/) – backend services (auth, catalog, gateway)  
- [Postgres](https://www.postgresql.org/) – used by the auth service  
- [Next.js](https://nextjs.org/) – frontend storefront  
- [Docker Compose](https://docs.docker.com/compose/) – local orchestration  

---

## Getting Started

### Clone the repository
```bash
git clone https://github.com/yourusername/minishop.git
cd minishop
```

### Run with Docker Compose
```bash
cd deploy
docker compose up --build
```

### Access the application
- Storefront: [http://localhost:3000](http://localhost:3000)  
- API Gateway: [http://localhost:8080/api/products](http://localhost:8080/api/products)  
- Auth service: [http://localhost:3000/health](http://localhost:3000/health inside the container)  
- Catalog service: [http://localhost:3001/health](http://localhost:3001/health)  

---

## Example Requests

Fetch all products:
```bash
curl http://localhost:8080/api/products
```

Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register   -H "Content-Type: application/json"   -d '{"email":"test@example.com","password":"secret"}'
```

---

## Development Notes

- Each service has its own Dockerfile and `.env.example`.  
- The auth service relies on Postgres. Run the DB container before testing registration/login.  
- The catalog service currently serves products from memory for simplicity.  

---
