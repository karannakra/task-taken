const mongoose=require('mongoose')
const taskSchema=new mongoose.Schema({
        description:{
            type:String,
            required:true,
            trim:true
        },
        completed:{
            type: Boolean,
            required:true,
            trim:true,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Users'
        }
    },{
    timestamps:true
    }
)
// taskSchema.methods.toJSON=function(){
//     const user =this
//     const userObject=user.toObject()
//     console.log(userObject)
//     // delete userObject.task.owner
//     return userObject
// }


taskSchema.pre('save',function (next) {
    next()
})

const Task=mongoose.model('Task',taskSchema)
module.exports=Task