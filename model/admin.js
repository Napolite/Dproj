const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const AdminModel = new mongoose.Schema({
    id:{
        type:String,
        default: 'admin'
    },
    async password:{
        type:String,
        default: await bcrypt.hash('admin',10)
    }

},{collection:'admindb'})


module.exports = new mongoose.model('admindb',AdminModel)