var mongoose = require('mongoose');
var usuarios  = mongoose.model('users');
var express = require('express');
var app = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); //parsing application/json

exports.consultarUsuario = function(req, res){

    console.log('Servicio validador de login....');
    var email = req.params.email;
    var password = req.params.password

    console.log('Usuario:', email);
    console.log('Clave:', password);

    var usuario = usuarios.find({'email': email})
    if(usuario.comparePassword(password)){
        var bandera = 1;
    } else {
        bandera = 0;
    }   

    //usuarios.find({'email':email, 'password':password})
    usuarios.find({'email':email})
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
    });

}

