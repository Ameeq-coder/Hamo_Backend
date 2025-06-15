const { signupServiceMan,loginServiceMan } = require('../controller/servicemanauthcontroller')

const router=require('express').Router()

router.post('/signup-serviceman', signupServiceMan); // 👈 new route

router.post('/login-serviceman',loginServiceMan)

module.exports=router;