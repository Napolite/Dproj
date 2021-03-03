const mongoose = require('mongoose')

const studentModel = new mongoose.Schema({
    name:String,
    matric_number:{
        type:String,
        required:true
    },
    dept:String,
    level:String,
    gender:String,
    courses:Array,
    password:{
        type:String,
        required:true
    }
},{collection:'studentModel'})


module.exports = new mongoose.model('studentModel',studentModel)