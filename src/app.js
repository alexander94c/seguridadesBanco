var express = require('express');
var engine  = require('ejs-mate'); //importa la libreria del motor de plantillas
var path    = require('path');
var morgan  = require('morgan');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');


//Inicializations
var app = express();
require('./database');
require('./passport/localAuth');

//require('./css/miEstilo.css');


//HAGO PUBLICA MI CARPETA PUBLIC
//app.use(express.static(__dirname + './public'));
app.use(express.static('public'))

//Ajustes
//establecer el directorio de la carpeta views
app.set('views', path.join(__dirname, 'views'));
//Indica el motor de este modulo
app.engine('ejs', engine );
//establecer el motor de plantillas
app.set('view engine', 'ejs');
//utiliza el puerto del SO o el 3000
app.set('port', process.env.PORT || 3000);



//middlewares
//funciones que se ejecutan antes que las rutas
app.use(morgan('dev'));
//recibir los datos desde el form de registro
app.use(express.urlencoded({extended: false}));
//declaracion de la sesion
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized:false
}));

app.use(flash());//para los mensajes 
//inicializa modulo de password - passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.mensajeRegistroUser = req.flash('mensajeRegistroUser');
    app.locals.mensajeLoginUser = req.flash('mensajeLoginUser');
    app.locals.user = req.user;
    next();
});

//Routes
app.use('/', require('./routes/index'));



//starting server 
app.listen(app.get('port'), () => {
    console.log('Node JS corriendo en el puerto -', app.get('port'));
});

