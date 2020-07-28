const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const sharp=require('sharp')
const JWT=require('jsonwebtoken')
const Task=require('./task')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        trim:true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error('email is not valid')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    ,
    avatar:{
        type:Buffer
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(password){
            if(password.length<6){
                throw new Error('password is less then 6 words')
            }
        }
    }},{
    timestamps:true
})


userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.generateToken=async function (){
        const user=this
        const token=JWT.sign({_id: user.id.toString()}, process.env.JWT_SECRET)
        user.tokens=user.tokens.concat({token})
        await user.save()
        return token
}

userSchema.statics.findByCredentials=async (email,password)=>{
        const user=await User.findOne({email:email})
        if(!user){
            throw new Error('email does not exist')
        }
        const isMatch=await bcrypt.compare(password,user['password'])
        if(!isMatch){
          throw new Error('password is not correct')
        }
        return user
}
userSchema.methods.toJSON= function(){
        const user=this
        const userObject=user.toObject()
        delete userObject.password
        delete userObject.tokens
        delete userObject.avatar
        return userObject

}
//hash the plane text password for saving
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
         user.password=await bcrypt.hash(user.password, 8)
    }
    next()
})
//delete user task after deleting the user
userSchema.pre('remove',async function (next) {
        const user=this
        await Task.deleteMany({owner:user._id})
        next()

    }
)
const User=mongoose.model('Users',userSchema)


module.exports=User