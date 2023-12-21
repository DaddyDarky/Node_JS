CRETE TRIGGER before_insert_alumno_asignatura
BEFORE INSERT ON before_insert_alumno_asignatura
FOR EACH ROW
BEGIN 
    DECLARE alumno_count INT;
    SET alumno_count = (SELECT COUNT(*)FROM alumno_asignatura WHERE asignatura = NEW.asignatura);
    IF alumno_count > 32 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No se puede asignar mas de 32 alumnos'
    END IF;
    END;

    DELIMITER;

CRETE TRIGGER before_update_alumno_asignatura
BEFORE INSERT ON before_update_alumno_asignatura
FOR EACH ROW
BEGIN 
    DECLARE alumno_count INT;
    SET alumno_count = (SELECT COUNT(*)FROM alumno_asignatura WHERE asignatura = NEW.asignatura);
    IF alumno_count >= 32 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'No se puede asignar mas de 32 alumnos'
    END IF;
    END;

    DELIMITER;    