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


















































// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
    });
