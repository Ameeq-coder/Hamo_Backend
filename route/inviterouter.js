const express = require('express');
const router = express.Router();
const {sendInvite,respondToInvite,getInvitesForUser}=require('../controller/invitecontroller')



router.post('/send', sendInvite);
router.post('/respond/:inviteId', respondToInvite);
router.get('/user/:userId', getInvitesForUser);


module.exports = router;
