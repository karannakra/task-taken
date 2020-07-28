const express=require('express')
const Task=require('../model/task')
const auth=require('../middleware/auth')
const router=new express.Router()



router.get('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id

    try {
        // const task=await Task.findById(id)
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send({status:'failed',reason:'no task found with the given id please authenticate yourself'})
        }
        res.status(200).send({status:'success',task})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error})

    }

})

router.get('/tasks',auth,async (req, res) => {
    const match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')[1]
        sort[parts[0]]=parts[1]==='desc'?-1:1
    }
    try {
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        if(req.user.tasks.length===0){
            return  res.status(200).send({status:'success',tasks:'no task found with the given condition'})
        }
        res.status(200).send({status:'success',tasks:req.user.tasks})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error})
    }

})

router.post('/tasks/me', auth,async (req, res) => {
    // const task = new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        return res.status(201).send({status:'task saved'})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error})
    }

})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperation=updates.every((element)=>{
        return allowedUpdates.includes(element);
    })
    if(!isValidOperation){
        return  res.status(400).send({status:'failed',error:'there are some of the values that cannot be edited or does not exist'})
    }
    try {
        const task = await Task.findOne({_id,owner:req.user._id})
        updates.forEach((updates)=>task[updates]=req.body[updates])
        await task.save()
        if (!task) {
            return res.status(404).send({status:'failed',reason:'task does not exist'})
        }
        res.status(200).send({status: 'updated', task})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error})

    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try {
        const task=await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send({status:'failed',reason:"task is not found"})
        }
        res.status(200).send({status:'success',task})
    }
    catch (error) {
        res.status(500).send(error)
    }
})

module.exports=router



// router.get('/tasks',async (req,res)=>{
//     try {
//         const task= await Task.find({})
//         res.status(200).send({status:'success',task})
//     }
//     catch (error) {
//
//         res.status(500).send({status:'failed',reason:error})
//     }
// const task=await Task.find({})
// Task.find({}).then((result)=>{
//     res.send(result)
// }).catch((error)=>{
//     res.status(404).send(error)
// })
// })





// Task.find({}).then((result) => {
//     res.send(result)
// }).catch((error) => {
//     res.status(500).send(error)
// })



// task.save().then(() => {
//     res.status(201).send('task saved')
// }).catch((error) => {
//     res.status(400).send(error)
// })

// Task.findById(id).then((task)=>{
//     if(!task){
//         return res.status(404).send('not found')
//     }
//     res.send(task)
// }).catch((Error)=>{
//     res.status(500).send(Error)
// })


