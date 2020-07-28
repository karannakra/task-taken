const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    const data={
        to:email,
        from:'karannakra1@gmail.com',
        subject:'thanx for joining in',
        text:`Welcome to the app,${name} let me know how you get along with the app.`
    }
    sgMail.send(data).then((data)=>{
        console.log(data)
    }).catch((error)=>{
        console.log(error)
    })

}
const deleteEmail=(email,name)=>{
    const data={
        to:email,
        from:'karannakra1@gmail.com',
        subject:'deleting the account',
        text:`${name}let us know what we did wrong so that we can improve do come back asap`
    }
    sgMail.send(data).then((data)=>{
        console.log(data)
    }).catch((error)=>{
        console.log(error)
    })
}
module.exports={
    sendWelcomeEmail,
    deleteEmail
}