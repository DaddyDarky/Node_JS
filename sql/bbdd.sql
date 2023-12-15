CREATE DATABASE IF NOT EXISTS `gestion`;

use `gestion`;

DROP TABLE IF EXISTS alum_asig;
DROP TABLE IF EXISTS profe_asig;
DROP TABLE IF EXISTS asignatura;
DROP TABLE IF EXISTS alumno;
DROP TABLE IF EXISTS profesor;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(52) NOT NULL,
    password VARCHAR(336) NOT NULL
);

CREATE TABLE alumno (
    alumno_id INT PRIMARY KEY,
    user_id INT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE profesor (
    profesor_id INT PRIMARY KEY,
    user_id INT,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE asignatura (
    asignatura_id INT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    curso SMALLINT NOT NULL,
    ciclo VARCHAR(30) NOT NULL
);

CREATE TABLE alum_asig (
    alumno_id INT NOT NULL,
    asignatura_id INT NOT NULL,
    PRIMARY KEY (alumno_id, asignatura_id),
    FOREIGN KEY (alumno_id) REFERENCES alumno(alumno_id),
    FOREIGN KEY (asignatura_id) REFERENCES asignatura(asignatura_id)
);

CREATE TABLE profe_asig (
    profesor_id INT NOT NULL,
    asignatura_id INT NOT NULL,
    PRIMARY KEY (profesor_id, asignatura_id),
    FOREIGN KEY (profesor_id) REFERENCES profesor(profesor_id),
    FOREIGN KEY (asignatura_id) REFERENCES asignatura(asignatura_id)
);
