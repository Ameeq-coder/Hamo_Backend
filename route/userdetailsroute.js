const { createUserDetails,getUserDetails } = require('../controller/userdetailscontroller')

const router=require('express').Router()



router.route('/createUserDetails').post(createUserDetails)

router.route('/getUserDetails').get(getUserDetails);  // 👈 add login route

module.exports=router;