const jwt = require('jsonwebtoken')

const authuser=(req,res,next)=>{
    const authkey = req.headers['authorization']
    if(!authkey || authkey === null || authkey.split(' ')[0] !== 'Bearer'){
        res.status(401).json({message:'authkey not available or wrong,log in again'+authkey,authkey:authkey})
    }
    const token = authkey.split(' ')[1]
    if(!token || token === null){
        res.status(401).json({message:'authkey not available or wrong'})
    }
    jwt.verify(token,'SECRET_KEY',(err,user)=>{
        if(err){
            res.json({message:'jwt verification error'})
        }
        req.user = user
        console.log(user)
        next()
    })

}

module.exports = authuser