var mongoose = require('mongoose');
var users  = mongoose.model('users');



exports.consultarUsuario = function(req, res){

    console.log('Servicio validador de login....');

    var username = req.params.username;

    users.find({'email':username}).exec()
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