Create a full stack project called "pastel-movies".

Backend:

- Spring Boot project.
- Project Name: `pastel-movies`
- Base Package: `br.com.luizalfredo23.pastelmovies`

Stack:
- Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA
- PostgreSQL
- Flyway
- Docker
- Maven

Architecture: br.com.luizalfredo23.pastelmovies

- controller
- service
- repository
- model
- dto
- config
- exception

Database:

Use PostgreSQL in Docker

Create docker-compose.yml

PostgreSQL container:

- name: pastel-movies-db
- database: pastel_movies
- username: postgres
- password: postgres
- port: 5434

docker-compose.yml:

version: '3.8'

services:

postgres:
image: postgres:11
container_name: pastel-movies-db
environment:
POSTGRES_DB: pastel_movies
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
ports:
- "5434:5432"
volumes:
- postgres_data:/var/lib/postgresql/data

volumes:
postgres_data:

Spring Boot Configuration:

application.yml:

spring:
datasource:
url: jdbc:postgresql://localhost:5434/pastel_movies
username: postgres
password: postgres

jpa:
hibernate:
ddl-auto: validate
show-sql: true

flyway:
enabled: true
locations: classpath:db/migration

Flyway:

Create migration folder:

src/main/resources/db/migration

Create migration files:

V1__create_tables.sql
V2__insert_seed_data.sql

Entities:

Movie

- id
- title
- year
- duration
- synopsis

Genre

- id
- name

Actor

- id
- name

User

- id
- name
- email

Review

- id
- rating
- comment

Relationships:

Movie

- ManyToMany Genres
- ManyToMany Actors
- OneToMany Reviews

Review

- ManyToOne Movie
- ManyToOne User

Flyway Migration:

V1__create_tables.sql

Create tables:

- movie
- genre
- actor
- user
- review
- movie_genre
- movie_actor

V2__insert_seed_data.sql

Insert sample data:

Genres:

- Action
- Drama
- Comedy
- Sci-Fi

Actors:

- Keanu Reeves
- Tom Hanks
- Scarlett Johansson

Movies:

- Matrix
- Forrest Gump
- Avengers

Users:

- Admin
- Test User

Reviews:

- sample reviews

Repositories:

MovieRepository
GenreRepository
ActorRepository
UserRepository
ReviewRepository

Services:

MovieService
GenreService
ActorService
UserService
ReviewService

Controllers:

/movies
/genres
/actors
/users
/reviews

Pagination:

GET /movies?page=0&size=10

Search:

GET /movies?search=matrix

Frontend:

React project:

pastel-movies-ui

Stack:

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router

Theme:

Pastel theme

Colors:

- pastel purple
- pastel pink
- pastel blue
- pastel green
- pastel yellow

Pages:

- Movies
- Genres
- Actors
- Users
- Reviews

Features:

- CRUD
- Pagination
- Search
- Sorting
- Filters

Generate clean production-ready code.
