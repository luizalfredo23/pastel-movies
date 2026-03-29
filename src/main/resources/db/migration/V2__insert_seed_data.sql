INSERT INTO genre (name) VALUES
    ('Action'),
    ('Drama'),
    ('Comedy'),
    ('Sci-Fi');

INSERT INTO actor (name) VALUES
    ('Keanu Reeves'),
    ('Tom Hanks'),
    ('Scarlett Johansson');

INSERT INTO movie (title, year, duration, synopsis) VALUES
    ('Matrix', 1999, 136, 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.'),
    ('Forrest Gump', 1994, 142, 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with a kind heart.'),
    ('Avengers', 2012, 143, 'Earth''s mightiest heroes must come together to stop Loki and his alien army from enslaving humanity.');

INSERT INTO movie_genre (movie_id, genre_id) VALUES
    (1, 4),
    (1, 1),
    (2, 2),
    (2, 3),
    (3, 1),
    (3, 4);

INSERT INTO movie_actor (movie_id, actor_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3);

INSERT INTO users (name, email) VALUES
    ('Admin', 'admin@pastelmovies.local'),
    ('Test User', 'test@pastelmovies.local');

INSERT INTO review (rating, comment, movie_id, user_id) VALUES
    (5, 'Mind-bending classic.', 1, 1),
    (4, 'Still holds up.', 1, 2),
    (5, 'Heartwarming and iconic.', 2, 1),
    (4, 'Great ensemble superhero film.', 3, 2);
