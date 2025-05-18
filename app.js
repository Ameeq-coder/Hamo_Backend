require('dotenv').config({path: `${process.cwd()}/.env`}); 
const express = require('express')

const app =express();


app.use(express.json());


const authRouter= require('./route/authroute');




app.get('/',(req,res) =>{
   res.status(200).json({
    status:'sucess',
    message:"Welcome To Hamo Backend"
   }) 
});


app.use('/api/v1/auth',authRouter)

const PORT=process.env.APP_PORT||5001


app.listen(PORT,()=>{
console.log('Server is running sucessfuly',PORT)
});