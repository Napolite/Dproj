const router = require("express").Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authuser = require('../middleware/authuser')
const Lecturer = require('../model/lecturer')
const Attendance = require('../model/attendance')
const startTime = 0
const endTime = 0

router.post('/register',async (req,res)=>{
    const {lecturerid,course,session,name,password} = req.body
    if(await Lecturer.findOne({name,lecturerid})){
        res.status(201).json({message:"this lecturer has been registered"})
    }
    const lecturer = new Lecturer({
        lecturerid,course:{title:course,isActive:false},session,name,password:await bcrypt.hash(password,10)
    })
    if(!await lecturer.validate()){
        await lecturer.save((err)=>{
            if(err) res.status(201).json({message:"cannot perform this operation"})
            else res.json({message:"Lecturer registered successfully"})
        })
    }else{
        res.status(400).json({message:'validation error. Check your input and try again'})
    }
})

router.post('/login',async(req,res)=>{
    const {lecturerid,password} = req.body

    const lecturer = await Lecturer.findOne({lecturerid})
    if(lecturer == null || !lecturer){
        res.status(401).json({message:'this lecturer has not been registered'})
    }else{
        if(await bcrypt.compare(password,lecturer.password)){
            user = {name:lecturer.name,lecturerid,course:lecturer.courses.course}
            const authkey = jwt.sign(user,'SECRET_KEY')
            res.json({message:"logged in succefully"})
        }else{
            res.status(401).json({message:'password is incorrect'})
        }
    }
})

router.post('/activate-attendance',authuser,async(req,res)=>{
    const course = await Lecturer.findOne({lecturerid:req.user.lecturerid})
    course.course.isActive = true
    startTime = new Date().getHours()
    await Lecturer.updateOne({lecturerid:req.lecturerid},{course:course,startTime:startTime},(err)=>{
        if(err){
            res.status(501).json({message:"course not activated"})
        }
        res.json({message:"Course is now active"})
    })
})

router.post('/deactivate-attendance',authuser,async(req,res)=>{
    const course = await Lecturer.findOne({lecturerid:req.user.lecturerid})
    course.course.isActive = false
    endTime = new Date().getHours()
    activeDuration = course.startTime - endTime
    await Lecturer.updateOne({lecturerid:req.lecturerid},{course:course,activeDuration:activeDuration},(err)=>{
        if(err){
            res.status(501).json({message:"course not activated"})
        }
        res.json({message:"Course is now active"})
    })
})

router.get('/profile',authuser,async(req,res)=>{
    lecturer = await Lecturer.findOne({lecturerid:req.user.lecturerid})
    res.json({lecturer:lecturer})
})
router.get('/view-attendance',authuser,async(req,res)=>{
    attendance = await Attendance.findOne({date:`${day.getDay} ${day.getMonth+1}`,course:req.user.course})
    res.json({message:attendance})
})

module.exports = router