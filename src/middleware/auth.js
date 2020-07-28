const JWT=require('jsonwebtoken')
const User=require('../model/user')

const auth=async (req,res,next)=>{
    try{
        const token=req.headers.authorization.replace('Bearer ','')
        const decoded= JWT.verify(token,'thisismynewcourse')
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
           throw new Error('please authenticate')
        }
        req.token=token
        req.user=user
        next()
    }
    catch (error) {
            res.status(401).send({error})
    }
}

module.exports=auth