const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json({ urlEncoded: true }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-requested-With,Content-type,Accept"
	);
	next();
});

mongoose.connect('mongodb://localhost/DprojDB',{useUnifiedTopology:true,useNewUrlParser:true})
mongoose.connection.on('error',()=>{
    console.log("there was an error connnecting to the db")
})

app.use("/student", require("./routers/student"));
app.use('/lecturer',require('./routers/lecturer'))
app.use('/admin',require('./routers/admin'))
app.listen(5000, () => {
	console.log("we are connected");
});
