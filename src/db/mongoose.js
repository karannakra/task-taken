const mongoose=require('mongoose')
const connectionURL=process.env.MONGO_DB_URL
mongoose.connect(connectionURL,{
    useCreateIndex:true,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
})

// const User=mongoose.model('users',{
//     name:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     age:{
//         type:Number,
//         required:true,
//         default:0,
//         validate(value){
//             if(value<0){
//                 throw new Error('number is less then 0')
//             }
//         }
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(email){
//             if(!validator.isEmail(email)){
//                 throw new Error('email is not valid')
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(password){
//             if(password.length<6){
//                 throw new Error('Password must be greater then 6')
//             }
//             if(password.toLowerCase().includes('password')){
//                 throw new Error('password should not contain password string')
//             }
//         }
//     }
// })
//
// // const user=new User({
// //     name:'karan nakra',
// //     email:'karannakra1@gmail.com',
// //     age:22,
// //     password:'karan@#123'
// // })
// // user.save().then((user)=>{
// //     console.log(user)
// // }).catch((error)=>{
// //     console.log(error)
// // })
// const Task=mongoose.model('tasks',{
//     description:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         required:true,
//         trim:true
//         }
// })
//
// const task=new Task({
//     description: "eaten lunch",
//     completed: false
// })
//
// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })
//
//
