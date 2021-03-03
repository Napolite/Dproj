const router = require("express").Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authuser = require('../middleware/authuser')
const Student = require('../model/student')
const Lecturer = require('../model/lecturer')
const Attendance = require('../model/attendance')

router.post("/register", async (req, res) => {
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

router.post('/login',async(req,res)=>{
	const {matric_number,password} = req.body
	const student = await Student.findOne({matric_number})
	if(student !== null){
		if(await bcrypt.compare(password,student.password)){
			const user = {matric_number,name:student.name}
			authkey = jwt.sign(user,'SECRET_KEY')
			res.status(200).json({
				message:"successful",
				authkey,
			})
		}else{
			res.status(201).json({message:'Password incorrect'})
		}
	}else{
		res.status(201).send({message:"Student not registered"})
	}
})

router.post('/add-courses',authuser,async(req,res)=>{
	const matric = req.user.matric_number
	const {courses} = req.body
	if(courses === null || courses === [] || !courses){
		res.status(403).json({message:"don't. just don't"})
	}
	await Student.updateOne({matric_number:matric},{courses:courses},(err)=>{
		if(err){
			res.status(403).json({message:"error performing this operation(edit courses)"})
		}
		res.json({message:"saved succesdfully"})
	})
})

router.get('/profile',authuser,async (req,res)=>{
	const student = await Student.findOne({matric_number:req.user.matric_number},(error)=>{
		if(error){
			res.status(403).json({message:error})
		}
		
	})
	res.json({
		student:student
	})
	
})
router.get('/get-courses',authuser,async(req,res)=>{
	const student = await Student.findOne({matric_number:req.user.matric_number})
	courses = student.course.map(c=>{
		lecture = Lecturer.findOne({course})

		if(lecturer.courses.isActive){
			return {course:c,active:true}
		}else{
			return {course:c,active:false}
		}
	})
	res.json({
		message:courses
	})
})

router.post('/mark-attendance',authuser,async(req,res)=>{
	lecturer = await Lecturer.findOne({course:req.headers.course})
	if(req.headers.course.isActive){
		attendance = await Attendance.findOne({course:req.headers.courses.course,date:`${day.getDay} ${day.getMonth+1}`})
		attendance.students.push(req.user.name)
		Attendance.updateOne({date:`${day.getDay} ${day.getMonth+1}`},{students:attendance.students})
	}else{

	}

})
module.exports = router
