const {
  createOrUpdateUserDetails,
  getUserDetails,
  getUsersByLocation
} = require('../controller/UserDetailscontroller');

const router=require('express').Router()
const upload = require('../middleware/upload');



router.post('/createdetails', upload.single('image'),createOrUpdateUserDetails);


router.get('/details/:userId', getUserDetails);

router.get('/alluser/by-location',getUsersByLocation)


module.exports = router;
