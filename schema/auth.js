const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    isAdmin:{
        type : Boolean,
        default : false
    }
});

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;