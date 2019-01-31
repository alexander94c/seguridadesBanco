var mongoose = require('mongoose');
var usuarios  = mongoose.model('users');
var express = require('express');
var app = express.Router();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); //parsing application/json

exports.consultarUsuario = function(req, res){

    console.log('Servicio validador de login....');
    var username = req.params.username;

    usuarios.find({'email':username}).exec()
    .then( doc =>{
        if(doc.length > 0){
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

