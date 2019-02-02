var express = require('express');
var passport = require('passport');
var router = express.Router();//Router devuelve un objeto 
var mongoose = require('mongoose');
var users  = mongoose.model('users');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../models/usuario');

var ctrlUsuario = require('../controllers/ctrlUsuario');

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
router.route('/loginUsuario/:email/:password')
.get(ctrlUsuario.consultarUsuario);

/*Registro de usuarios externo por metodos de sesiones de usuario */
router.post('/registroUser2', (req, res) => {

    var objUsuario = new users ({
        email: req.body.email,
        //password: req.body.password,
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


router.get('/comprobarUser/:email/:password', (req, res)  => {

    var email = req.params.email;
    var password = req.params.password

    console.log('Usuario:', email);
    console.log('Clave:', password);
 
    var claveB = Usuario.find({'password':password})
    .select('password')
    .exec()
    .then( doc =>{
        if(doc.length == 0){
            console.log('Password erroneo');            
            res.status(202).json({doc});
        }
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 

    Usuario.find({'email': email, 'password':password})
    .exec() 
    .then( doc =>{
        if(doc.length > 0){
            console.log('Username and Pass encontrado');            
            console.log(doc);            
            res.status(200).json({doc});
        }
        else{
            res.status(404).json({message:'No usuarios con ese nombre de usuario!'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });


    //var comparacion = bcrypt.compareSync(passwordGuardada,password);

    //console.log('Usuario Encontrado:', usuario1);

    /*Metodo de compatacion */ 
    //var comparacion = bcrypt.compareSync(passwordGuardada,password);


    /*if(usuario1.comparePassword(password)){
        bandera = 1;
    } else {
        bandera = 0;
    } */


    //usuarios.find({'email':email, 'password':password})
    /* users.find({'email':email})
    .exec()
    .then( doc =>{
        if(doc.length > 0 && bandera == 1){
            console.log(doc);
            res.status(200).json({doc});
        }else {
            res.status(404).json({message:'No usuarios con ese nombre de usuario!'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); */
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