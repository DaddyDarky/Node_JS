const express = require('express');
const session = require ('express-session');
const mysql = require('mysql12');
const bodyParser =  require('body-parser');
const path = require('path');

const app = express();
const port = 8000;


const db = mysql.createConnection({
    host:'localhost',
    port:33308,
    user:'root',
    password:'s83n38DGB8d72',
    database:'gestion'
});

db.connect(err=>{
    if (err){
        console.log("Error de cojones")
        return;
    }
    console.log("Que hay wifi, vamooos")
});

app.use(
    session({
        secret : 'pim pam toma nacasitos',
        resave : false,
        saveUninitialized: true,
    })
);

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser.urlencoded({extended : true}));

app.use((req,res,next)=>{
    res.locals.user = req.session.user || null;
    if (req.session.user===undefined && !req.path.startsWith("/login"))
        res.redirect("/login");
    else
        next();
});

app.get('/',(req,res)=>{
    res.render('index',{user: req.session.user});
})

app.get('/login',(req, res)=>{
    res.render('login');
});
