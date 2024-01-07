const express = require('express');
const session = require ('express-session');
const mysql = require('mysql2');
const bodyParser =  require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

//Configuracion a MySQL
const db = mysql.createConnection({
    host:'localhost',
    port:33308,
    user:'root',
    password:'s83n38DGB8d72',
    database:'gestion'
});

//Conexion a MySQL
db.connect(err=>{
    if (err){
        console.log("Error de cojones")
        return;
    }
    console.log("Que hay wifi, vamooos")
});

//Configuracion de sesiones
app.use(
    session({
        secret : 'pim pam toma nacasitos',
        resave : false,
        saveUninitialized: true,
    })
);

//Configuracion de pug
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

//Configuracion del middleware
app.use(bodyParser.urlencoded({extended : true}));


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    if (!req.session.user && !req.path.match("/login"))
        res.redirect("/login")
    else
        next();
    });
    
    // RUTAS
    // ruta por defecto
    
    app.get('/', (req, res) => {
    res.render('index');
});
/**
 * app.use((req,res,next)=>{
    res.locals.user = req.session.user || null;
    if (req.session.user===undefined && !req.path.startsWith("/login"))
        res.redirect("/login");
    else
        next();
});

//Ruta por defecto
app.get('/',(req,res)=>{
    res.render('index',{user: req.session.user});
});
*/


// ruta por defecto
app.get('/', (req, res) => {
    res.render('index');
    });

    // ruta para el login
    app.get('/login', (req, res) => {
    res.render('login');
    });

    app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Verificación de credenciales en MySQL
    
    const query = 'SELECT * FROM users WHERE username = ? AND password =?';
    db.query(query, [username, password], (err, results) => {
    if (err) {
        console.error('Error al verificar las credenciales:', err);
    res.render("error", {mensaje: "Credenciales no válidas."});
    } else {
        if (results.length > 0) {
            req.session.user = username;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
    if (err) res.render("error", {mensaje: err});
    else res.redirect('/login');
    });
});


app.get('/login',(req, res)=>{
     res.render('login');
 });


 app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificación de credenciales en MySQL
    const query = 'SELECT * FROM users WHERE username = ? AND password =';
    db.query(query, [username, password], (err, results) => {
    if (err) {
        console.error('Error al verificar las credenciales:', err);
    res.render("error", {mensaje: "Credenciales no válidas."});
    } else {
        if (results.length > 0) {
    req.session.user = username;
    res.redirect('/')
    } else {
    res.redirect('/login');
    }
    }
    });
 });


 app.get('/alumnos-add', (req, res) => {
    res.render('alumnos-add');
    });
    
    app.post('/alumnos-add', (req, res) => {
    // Insertar un nuevo alumno en la base de datos
    
    const { nombre, apellido } = req.body;
    db.query('INSERT INTO alumno (nombre, apellido) VALUES (?, ?)', [
    nombre, apellido], (err, result) => {
    if (err) res.render("error", {mensaje: err});
     else res.redirect('/alumnos');
    });
    
    });
    




// Rutas verbo accion
app.get('/alumnos', (req, res) => {
    // Obtener todos los alumnos de la base de datos
    db.query('SELECT * FROM alumno', (err, result) => {
    if (err)    
        res.render("error", {mensaje: err});
    else res.render('alumnos', { alumnos: result });
    });
});





app.get('/alumnos-edit/:id', (req, res) => {
     const alumnoId = req.params.id;
     // Obtener un alumno por su ID
    db.query('SELECT * FROM alumno WHERE id = ?', [alumnoId], (err,
    result) => {
    if (err) res.render("error", {mensaje: err});
    else res.render('alumnos-edit', { alumno: result[0] });
        });
})

app.post('/alumnos-edit/:id', (req, res) => {
    const alumnoId = req.params.id;
    // Actualizar un alumno por su ID
    const { nombre, apellido } = req.body;
    db.query('UPDATE alumno SET nombre = ?, apellido = ? WHERE id = ?', [nombre, apellido, alumnoId], (err, result) => {
    if (err)
        res.render("error", {mensaje: err});
    else
        res.redirect('/alumnos');
    });
});



app.get('/alumnos-delete/:id', (req, res) => {
    
     const alumnoId = req.params.id;
    // Obtener y mostrar el alumno a eliminar
 db.query('SELECT * FROM alumno WHERE id = ?', [alumnoId], (err,
    result) => {
     if (err)
     res.render("error", {mensaje: err});
    else
     res.render('alumnos-delete', { alumno: result[0] });
     });

     });
    
     app.post('/alumnos-delete/:id', (req, res) => {
     const alumnoId = req.params.id;
     // Eliminar un alumno por su ID
     db.query('DELETE FROM alumno WHERE id = ?', [alumnoId], (err,
    result) => {
     if (err)
     res.render("error", {mensaje: err});
     else
     res.redirect('/alumnos');
     });
    
     });
    
     app.get('/asignaturas', (req, res)=> {
         db.query('SELECT * FROM asignatura', (err, result) => {
         if (err)
         res.render("error", {mensaje: err});
        else {
         res.render("asignaturas", {asignaturas: result});
         }
         });
        });
        
         app.get('/asignaturas-add', (req, res)=> {
         res.render("asignaturas-add");
         });
        
         app.post('/asignaturas-add', (req, res)=> {
         // Insertar un nuevo alumno en la base de datos
         const { nombre, ciclo, curso } = req.body;
         db.query('INSERT INTO asignatura (nombre, ciclo, curso) VALUES (?, ?,?)', [nombre, ciclo, curso], (err, result) => {
        if (err) throw err;
         res.redirect('/asignaturas');
         });
         });
        
         app.get('/asignaturas-edit/:id', (req, res)=> {
         const asignaturaId = req.params.id;
         db.query('SELECT * FROM asignatura WHERE id = ?', [asignaturaId], (
        err, result) =>{
         if (err)
        res.render("error", {mensaje: err});
         else
         res.render("asignaturas-edit", {asignatura: result[0]});
        });
        
         });
        
        
         app.post('/asignaturas-edit/:id', (req, res) => {
        
         const asignaturaId = req.params.id;
         // Actualizar un asignatura por su ID
         const { nombre, ciclo, curso } = req.body;
         db.query('UPDATE asignatura SET nombre = ?, ciclo = ?, curso = ?WHERE id = ?', [nombre, ciclo, curso, asignaturaId], (err, result)=> {
            if (err)
             res.render("error", {mensaje: err});
             else
             res.redirect('/asignaturas');
             });
            
             });
            
             app.get('/asignaturas-delete/:id', (req, res) => {
            
             const asignaturaId = req.params.id;
             // Obtener y mostrar el asignatura a eliminar
             db.query('SELECT * FROM asignatura WHERE id = ?', [asignaturaId], (
            err, result) => {
             if (err)
             res.render("error", {mensaje: err});
             else
             res.render('asignaturas-delete', { asignatura: result[0] });
             });
            
             });
            
             app.post('/asignaturas-delete/:id', (req, res) => {
             const asignaturaId = req.params.id;
             // Eliminar un asignatura por su ID
             db.query('DELETE FROM asignatura WHERE id = ?', [asignaturaId], (err,
            result) => {
             if (err)
             res.render("error", {mensaje: err});
             else
             res.redirect('/asignaturas');
             });
            
             });

             app.get('/matricular', (req, res) => {
                 // Obtener lista de alumnos y asignaturas
                 const queryAlumnos = 'SELECT * FROM alumno';
                 const queryAsignaturas = 'SELECT * FROM asignatura';
                
                 db.query(queryAlumnos, (errAlumnos, resultAlumnos) => {
                 if (errAlumnos) throw errAlumnos;
                
                 db.query(queryAsignaturas, (errAsignaturas, resultAsignaturas) => {
                 if (errAsignaturas) throw errAsignaturas;
                
                 res.render('matriculas', {
                 alumnos: resultAlumnos,
                 asignaturas: resultAsignaturas,
                 });
                 });
                 });
                 });
                
                 app.post('/matricular', (req, res) => {
                 const { alumno, asignatura } = req.body;
                
                 // Verificar si la matrícula ya existe
                 const queryExistencia = 'SELECT * FROM alumno_asignatura WHERE alumno= ? AND asignatura = ?';
                db.query(queryExistencia, [alumno, asignatura], (errExistencia,
                resultExistencia) => {
                 if (errExistencia) throw errExistencia;
                
                 if (resultExistencia.length === 0) {
                 // Matricular al alumno en la asignatura
                 const queryMatricular = 'INSERT INTO alumno_asignatura (alumno,asignatura) VALUES (?, ?)';
                 db.query(queryMatricular, [alumno, asignatura], (errMatricular)=> {
                 if (errMatricular) throw errMatricular;
                
                 res.redirect('/matricular');
                 });
                 } else {
                 // Matrícula ya existe
                 res.render('error', {mensaje: 'La matrícula ya existe'});
                 }
                });
            });
                
                 app.get('/asignaturas/:alumnoId', (req, res) => {
                 const alumnoId = req.params.alumnoId;
                
                 // Obtener asignaturas matriculadas para el alumno seleccionado
                 const queryAsignaturasMatriculadas = `
                 SELECT asignatura.nombre as asignatura, alumno.*
                 FROM asignatura, alumno, alumno_asignatura
                 WHERE alumno_asignatura.alumno = ?
                 AND asignatura.id = alumno_asignatura.asignatura
                 AND alumno.id = alumno_asignatura.alumno;`;
                
                 db.query(queryAsignaturasMatriculadas, [alumnoId], (err, result) => {
                 if (err) res.render('error', {mensaje: err});
                 else {
                 const asignaturas = result;
                 db.query('select * from alumno where alumno.id=?', [alumnoId], (err, result) => {
                 if (err) res.render('error', {mensaje: err});
                 else
                 res.render('asignaturas-alumno', {alumno: result[0], asignaturasMatriculadas: asignaturas});
                 });
                 }
                 });
                 });
                




                 app.get('/profesores-add', (req, res) => {
                    res.render('profesores-add');
                });
                
                app.post('/profesores-add', (req, res) => {
                    // Insertar un nuevo profesor en la base de datos
                
                    const { nombre, apellido } = req.body;
                    db.query('INSERT INTO profesor (nombre, apellido) VALUES (?, ?)', [
                        nombre, apellido], (err, result) => {
                            if (err) res.render("error", { mensaje: err });
                            else res.redirect('/profesores');
                        });
                
                });
                
                // Rutas verbo acción
                app.get('/profesores', (req, res) => {
                    // Obtener todos los profesores de la base de datos
                    db.query('SELECT * FROM profesor', (err, result) => {
                        if (err)
                            res.render("error", { mensaje: err });
                        else res.render('profesores', { profesores: result });
                    });
                });
                
                app.get('/profesores-edit/:id', (req, res) => {
                    const profesorId = req.params.id;
                    // Obtener un profesor por su ID
                    db.query('SELECT * FROM profesor WHERE id = ?', [profesorId], (err,
                        result) => {
                            if (err) res.render("error", { mensaje: err });
                            else res.render('profesores-edit', { profesor: result[0] });
                        });
                });
                
                app.post('/profesores-edit/:id', (req, res) => {
                    const profesorId = req.params.id;
                    // Actualizar un profesor por su ID
                    const { nombre, apellido } = req.body;
                    db.query('UPDATE profesor SET nombre = ?, apellido = ? WHERE id = ?', [nombre, apellido, profesorId], (err, result) => {
                        if (err)
                            res.render("error", { mensaje: err });
                        else
                            res.redirect('/profesores');
                    });
                });
                
// Rutas verbo accion
app.get('/profesores', (req, res) => {
    // Obtener todos los profesores de la base de datos
    db.query('SELECT * FROM profesor', (err, result) => {
        if (err)
            res.render("error", { mensaje: err });
        else res.render('profesores', { profesores: result });
    });
});

app.get('/profesores-edit/:id', (req, res) => {
    const profesorId = req.params.id;
    // Obtener un profesor por su ID
    db.query('SELECT * FROM profesor WHERE id = ?', [profesorId], (err,
        result) => {
            if (err) res.render("error", { mensaje: err });
            else res.render('profesores-edit', { profesor: result[0] });
        });
});

app.post('/profesores-edit/:id', (req, res) => {
    const profesorId = req.params.id;
    // Actualizar un profesor por su ID
    const { nombre, apellido } = req.body;
    db.query('UPDATE profesor SET nombre = ?, apellido = ? WHERE id = ?', [nombre, apellido, profesorId], (err, result) => {
        if (err)
            res.render("error", { mensaje: err });
        else
            res.redirect('/profesores');
    });
});

app.get('/profesores-delete/:id', (req, res) => {
    const profesorId = req.params.id;
    // Obtener y mostrar el profesor a eliminar
    db.query('SELECT * FROM profesor WHERE id = ?', [profesorId], (err,
        result) => {
            if (err)
                res.render("error", { mensaje: err });
            else
                res.render('profesores-delete', { profesor: result[0] });
        });
});

app.post('/profesores-delete/:id', (req, res) => {
    const profesorId = req.params.id;
    // Eliminar un profesor por su ID
    db.query('DELETE FROM profesor WHERE id = ?', [profesorId], (err,
        result) => {
            if (err)
                res.render("error", { mensaje: err });
            else
                res.redirect('/profesores');
        });

});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
    });
