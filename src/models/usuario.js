var mongoose = require('mongoose');
var bcrypt     = require('bcrypt-nodejs');
const {Schema} = mongoose;

const userSchema = new Schema({
    email: String,
    password: String,
    rol: String
});

//definicion de metodos para encriptar
userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//metodo para comparar passwords
//compara los passwords y si cumplen retorna true
userSchema.methods.comparePassword = function(password){

    return bcrypt.compareSync(password, this.password);
};

//model toma el esquema y guarda en la coleccion users
module.exports = mongoose.model('users', userSchema);

