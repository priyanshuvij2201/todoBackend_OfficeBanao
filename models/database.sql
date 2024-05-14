CREATE DATABASE ptodo;

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description VARCHAR(255),
);
ALTER TABLE todo
ADD COLUMN image_url VARCHAR(255);
