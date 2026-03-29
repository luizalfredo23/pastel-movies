# Pastel Movies

Full-stack demo: Spring Boot 3 (Java 21) API with PostgreSQL and Flyway, plus a React (Vite + TypeScript + Tailwind) UI.

## Prerequisites

- Java 21, Maven
- Docker (for PostgreSQL)
- Node.js 18+ (20+ recommended)

## Database

From the repository root:

```bash
docker compose up -d
```

PostgreSQL listens on host port **5434** (database `pastel_movies`, user/password `postgres`).

## Backend

```bash
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api` (e.g. `GET /api/movies?page=0&size=10&search=matrix`).

## Frontend

```bash
cd pastel-movies-ui
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` to the backend on port 8080.

## Production UI build

```bash
cd pastel-movies-ui
npm run build
```

Serve the `pastel-movies-ui/dist` folder as static files, or point your reverse proxy at the built assets while forwarding `/api` to Spring Boot.
