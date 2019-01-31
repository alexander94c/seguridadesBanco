var passport       = require('passport');
var localStrategy  = require('passport-local').Strategy;

var Usuario = require('../models/usuario');

passport.serializeUser((usuario,done) => {
    done(null,usuario.id);
});

passport.deserializeUser(async(id,done) => {
  var usuario = await Usuario.findById(id);
  done(null, usuario);

});

//a traves de que datos se va a registrar el usuario


passport.use('local-Registro', new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
}, async (req, email, password, done) => {

        var newUser = new Usuario();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.rol = req.body.rol;
        await newUser.save();
        /* .then(result => {
            console.log('1 usuario insertado-->:',result);
            console.log('STATUS 201....!!!!');
            res.status(201);
        })    */ 

        /* .then(result => {
            console.log('1 usuario insertado-->:',result);
            console.log('STATUS 201....!!!!');
            res.status(201);    
        }) */
        /* .catch(err => {
            console.log(err)
            res.status(500).json({error: err});
        }); */
        
        done(null, newUser);
    }
));


passport.use('local-Ingreso', new localStrategy({

    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true

}, async(req, email, password, done) => {
    
    var usuario= await Usuario.findOne({email: email})
   
    if(!usuario) {     
      return done(null, false, req.flash('mensajeRegistroUser','Usuario No Encontrado...'));
    }
    
    if(!usuario.comparePassword(password)){
        return done(null, false, req.flash('mensajeRegistroUser','Clave Incorrecta... Reingrese! '));
    }
    
    done(null, usuario); 
}));
