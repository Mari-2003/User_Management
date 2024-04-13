const mongoose = require('mongoose');

const roles =["User","Admin"]
    

const usersSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        enum:roles,
        default: 'User'
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});;

const users =  mongoose.model('users',usersSchema);
module.exports = users;