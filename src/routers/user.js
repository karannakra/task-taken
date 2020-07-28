const express=require('express')
const router=new express.Router()
const User=require('../model/user')
const multer=require('multer')
const auth=require('../middleware/auth')
const {sendWelcomeEmail,deleteEmail}=require('../emails/account')
const upload=multer({
    limits:{
        fileSize:10000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('please upload a picture'),true)
        }
        cb(undefined,true)
        // cb(new Error('file must be an image'))

        // cb(undefined,false)
    }
})
router.get('/users/me',auth,async (req, res) => {
    try {
         res.send(req.user)
    }
    catch (error) {
        res.status(500).send(error)
    }
    // try {
    //     const user=await User.find({})
    //     res.status(200).send({status:'success',user})
    // }
    // catch (error) {
    //     res.status(500).send({status: 'failed', reason:error})
    // }
    // const user= await User.find({}).then((result) => {
    //       res.send(result)
    //   }).catch((error) => {
    //       res.status(500).send(error)
    //   })
})

// router.get('/users/:id',auth,async (req, res) => {
//     const id = req.params.id
//     try {
//         const user=await User.findById(id)
//         if(!user){
//             return res.status(404).send({status:'failed',reason:'user with the given id does not exist'})
//         }
//         res.status(200).send({status:'success',user})
//     }
//     catch (error) {
//         res.status(500).send({status:'failed',reason:error})
//     }
//     // User.findById(id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send('user not found')
//     //     }
//     //     res.send(user)
//     // }).catch((error) => {
//     //     res.status(500).send(error)
//     // })
// })

router.post('/users',async (req, res) => {
    const email=await User.findOne({email:req.body.email})
    if(email){
        return res.send({status:"failed",reason:'email already taken'})
    }
    const user=new User(req.body)
    try{
        await  user.save()
        await sendWelcomeEmail(user.email,user.name)
        const token= await user.generateToken()
        res.status(201).send({status:'success',user,token})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error.message})

    }
})
router.post('/users/logout',auth,async(req,res)=>{
    try {  const user=await User.findById(req.user.id)
        user.tokens=user.tokens.filter((token) => token.token !== req.token)
        await user.save()
        res.status(200).send({status:'logout'})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error})
    }


})
router.post('/users/logoutall',auth,async(req,res)=>{
 try {
        const user=req.user
        user.tokens=[]
        await user.save()
        res.status(200).send({status:'success',info:"logged out from all devices"})

 }
 catch (error) {
            res.status(500).send({status:"failed",reson:error})
 }
})

// User.findOne({
//     email: req.body.email
// }).then((result) => {
//     if (result) {
//         return res.send('email already taken')
//     }
// })
// const user = new User(req.body)
// user.save().then(() => {
//     res.status(201).send('data saved')
//
// }).catch((error) => {
//     res.status(400).send(error)
//
// })



router.post('/users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateToken()
        if(!user){
           return res.send('not found')
        }
        res.send({status:'logged in',user,token})
    }
    catch (error) {
        res.status(400).send({status:'fail',reason:error})
    }
})


router.patch('/users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((element)=>{
        return allowedUpdates.includes(element);
    })
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        if(updates.includes('email')) {
            const user = await User.findOne({email: req.body.email})
            if(user){
                return res.status(501).send({status:'failed',reason:'email already taken by some other user'})
            }
        }
        if(!isValidOperation){
            return  res.status(501).send({status:'failed',error:"there are some of the values  that cannot be edited or doesnot exist"})
        }
        await req.user.save()
        res.send(req.user)
            // const user= await User.findById(req.params.id)
            // updates.forEach((update)=> user[update]=req.body[update])
            // console.log(user)
            // await user.save()
            // return
        // const user= await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     return  res.status(404).send({status:'failed',reason:'user not found'})
        // }

    }
    catch (error) {
        res.status(400).send({status:'failed',reason:error['message']})
    }

})

router.delete('/users/me',auth,async (req,res)=>{
    try {
        // const user=await User.findByIdAndDelete(id,{new:false})
        //
        // if(!user){
        //     return res.status(404).send({status:'failed',reason:"the user is not found"})
        // }
       await req.user.remove()
       await deleteEmail(req.user.email,req.user.name)
        res.status(200).send({status:'success',user:req.user})
    }
    catch (error) {
        res.status(500).send({status:'failed',reason:error})
    }
})
// const errorMiddleware=(req,file,cb)=>{
//     throw new Error('from my middleware')
// }

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    req.user.avatar=await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    await req.user.save()
    res.send({status:'success'})
},
    (error,req,res,next)=>{
    if(error.message){
     return res.status(400).send({status:'failed',error:error.message})
    }
    next()
})
router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send({status:'deleted'})
})

router.get('/users/:id/avatar',auth,async (req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if(!user.avatar||!user){
            throw new Error('image does not exist')
        }
        res.set('Content-Type','image/jpeg')
        res.send(user.avatar)
    }
    catch (error) {
        res.status(404).send({status:'failed',reason:error})
    }

})
module.exports=router