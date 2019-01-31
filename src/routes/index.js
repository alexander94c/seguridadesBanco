var express = require('express');
var passport = require('passport');
var router = express.Router();//Router devuelve un objeto 
var mongoose = require('mongoose');
var users  = mongoose.model('users');
var bodyParser = require('body-parser');

/**/
var bcrypt = require('bcrypt-nodejs');
var BCRYPT_SALT_ROUNDS = 10;

var ctrlUsuario = require('../controllers/ctrlUsuario');


//require('./models/usuario');

router.use(bodyParser.json()); //parsing application/json

router.get('/', (req,res,next) =>{
    res.redirect('/login');
});

router.get('/registro', (req,res,next) => {
    res.render('registroUser');
});

router.post('/registro', 
    passport.authenticate('local-Registro',{
        successRedirect: '/views/registroExito', //Si el logueo es correcto redirecciona a la raiz
        failureRedirect: '/registro',   //redireccion si el logueo tiene problemas
        passReqToCallback: true
    })
);

router.post('/ingresarUsuario', (req, res)=>{
    var password = req.body.password
    var encriptado = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    var usuarioNew = new users({
        email: req.body.email,
        password: encriptado,
        rol: req.body.rol
    });

    usuarioNew.save().then(result => {
        console.log('1 usuario insertado-->:',result);
        res.status(201).end();
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });

});

router.get('/login', (req,res,next) => {
    res.render('loginUser');
});

router.post('/login', 
    passport.authenticate('local-Ingreso', {
        successRedirect: '/views/perfil',
        failureRedirect: '/login',
        passReqToCallback: true
    })
);

router.get('/cerrarSesion', (req, res, next ) => {
    req.logOut();
    res.redirect('/login');
});

/*Metodo que consulte si los datos existe y retorna el status 200 0 404*/
router.route('/loginUsuario/:username')
.get(ctrlUsuario.consultarUsuario);

router.post('/registroUser2', (req, res) => {

    console.log('****** Servicio creador de usaurios 2*****')

    var objUsuario = new users ({
        email: req.body.email,
        password: users.encryptPassword(req.body.password),
        rol: req.body.rol
    });
    
    console.log('Datos recibidos...:',objUsuario);
    
    objUsuario.save().then(result => {
        console.log('Usuario insertado-->:',result);
        res.status(201).end();
    })
    
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err});
    });


});



//rutas para las vistas de la aplicación
router.get('/views/perfil',  (req, res, next) =>{
    res.render('perfil');
});


router.get('/correoNotifica', (req,res,next) => {
    res.render('correoConfirmar');
    console.log('Entra a Ruta del Correo Post');

});

router.get('/views/registroExito', (req,res,next) => {
    res.render('registroExito');

});


module.exports = router;