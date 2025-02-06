const mongoose = require('mongoose');
const signupSchema = mongoose.Schema({
    username:{
        type: String,
        require:true
    },
    email:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require: true
    }
})

const signup = mongoose.model('signup', signupSchema);
module.exports = signup;