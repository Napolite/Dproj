// const express = require('express')
router = requre('express')().Router()
const Admin = require('../model/admin')
const authuser = require('../middleware/authuser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Student = require('../model/student')
const Lecturer = require('../model/lecturer')
const Attendance = require('../attendance/Attendance')

router.post('/login',async(req,res)=>{
    const {id,password} = req.body
    const admin = Admin.findOne({id})
    if(admin){
        if(await bcrypt.compare(password,admin.password)){
            user = {name:admin,id:admin}
            accessToken = jwt.sign(user,'SECRET_KEY')
            res.json({authkey:accessToken})
        }else{
            res.json({message:"password is incorrect"})
        }
        
    }else{
            res.json({message:"contact CTO for admin details"})
        }
})

router.get('/get-students',authuser,async(req,res)=>{
    const students = await Student.find()
    students.map(s =>{
        return {name:s.name,matric_number:s.matric_number}
    })
    res.send({message:students})
})

router.get('/get-student',authuser,async(req,res)=>{
    const student= await Student.findOne({matric_number:req.header.matric_number})
    res.json({message:student})
})

router.post('/add-course',authuser,async(req,res)=>{
    const matric = req.headers.matric_number
    const student = await Student.findOne({matric_number:matric})
    courses = student.courses
    courses.push(req.body.courses)
    await Student.updateOne({matric_number:matric},{courses},(err)=>{
        res.json({message:"this action cannot be performed"})
    })
})

router.post("/register-student", async (req, res) => {
	const {
		name,
		matric_number,
		department,
		level,
		gender,
		password,
    } = req.body;
    if((await Student.findOne({name,matric_number}))!== null){
        res.json({message:"this student has been registered"})
    }else{
		hashPassword = await bcrypt.hash(password,10)
		const student = new Student({
			name,
			matric_number,
			department,
			level,
			gender,
			password:hashPassword,
		})
		if (!await student.validate()){
		try{
			await student.save((err)=>{
				if(err){res.status(201).json({message:'Cannot save at this time'})}
				else{res.status(200).json({message:"student created successfully"})}
			})
		}catch(err){
			console.log(err)
		}}else{res.status(201).json({message:'validation error, check your inputs and try again'})}
	}
});

router.post('/register-lecturer',async (req,res)=>{
    const {lecturerid,course,session,name,password} = req.body
    if(await Lecturer.findOne({name,lecturerid})){
        res.status(201).json({message:"this lecturer has been registered"})
    }
    const lecturer = new Lecturer({
        lecturerid,course:{title:course,isActive:false},course,session,name,password:await bcrypt.hash(password,10)
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

router.get('/view-courses',authuser,async(req,res)=>{
    attendance = await Lecturer.find()
    res.json({message:attendance.course})
})

router.get('/view-attendance',authuser,async(req,res)=>{
    attendance = await Attendance.findOne({date:`${day.getDay} ${day.getMonth+1}`,course:req.headers.course})
    res.json({message:attendance})
})

module.exports=router