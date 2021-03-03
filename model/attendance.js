const mongoose = require('mongoose')

attendance = new mongoose.Schema({
    course:String,
    date:{
        type:String,
        default:`${day.getDay} ${day.getMonth+1}`
    },
    students:{
        type:Array,
        default:[]
    }
},{collection:'AttendanceDB'})

module.exports = mongoose.model('AttendanceDB',attendance)