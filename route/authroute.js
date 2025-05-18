const { signup,login } = require('../controller/authcontroller')

const router=require('express').Router()



router.route('/signup').post(signup)

router.route('/login').post(login);  // 👈 add login route

module.exports=router;