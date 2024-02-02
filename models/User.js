const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique: true,
    },
    password:{
        type: String,
        required : true,
    },
    roles:{
        type: [String],
        default: ['USER'], // USER, ADMIN
    },
});

// Metodo para cifrar la contraseña antes de guardarla
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password  =await bcrypt.hash(this.password, salt);
    next();
});

module.exports   = mongoose.model('User', userSchema);