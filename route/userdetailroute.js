const {
  createOrUpdateUserDetails,
  getUserDetails,
} = require('../controller/UserDetailscontroller');

const router=require('express').Router()



router.post('/createdetails', createOrUpdateUserDetails);


router.get('/details/:userId', getUserDetails);


module.exports = router;
