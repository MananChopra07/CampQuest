let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-Local-Mongoose');
let UserSchema = new Schema({
    email:{
        type : String,
        required: true ,
        unique : true
    }
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);