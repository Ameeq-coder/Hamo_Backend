const {
  createOrUpdateUserDetails,
  getUserDetails,
} = require('../controller/UserDetailscontroller');

const router=require('express').Router()
const upload = require('../middleware/upload');



router.post('/createdetails', upload.single('image'),createOrUpdateUserDetails);


router.get('/details/:userId', getUserDetails);


module.exports = router;
