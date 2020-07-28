//examples are the end of the code
const express = require('express')
require('./db/mongoose')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/task')
const app = express()


const PORT = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(PORT, () => {
    console.log('started the server listening at port:' + PORT)
})



// const main=async ()=>{
//     // const task= await Task.findById('5f1a7e830c48aa1794d0ea40')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     // const user=await User.findById('5f1a73433f4def19603c5cea')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
//
// }
// main()




