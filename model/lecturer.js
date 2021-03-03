const mongoose = require('mongoose')

const LecturerModel = new mongoose.Schema({
    name:String,
    lecturer_id:String,
    course:String,
    courses:Object,
    session:String,
    attendance:Array,
    password:{
        type:String,
        min:4
    },
    activeDuration:Number,
    startTime:Number,
    endTime:Number,
},{collection:'lecturerModel'})

module.exports = mongoose.model('lecturerModel',LecturerModel)