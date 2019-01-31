//usando modulo mongoosee

var mongoose = require('mongoose');
const {mongodb} = require('./keys');


mongoose.connect(mongodb.URL, {useNewUrlParser: true})
    .then(db   => console.log('MongoDB connected succesfully!'))
    .catch(err => console.error(err));