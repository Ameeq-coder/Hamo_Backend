const express = require('express');
const router = express.Router();
const { createServiceDetail, 
     getServiceDetailByServiceManId,
     updateServiceDetail,
     getServicemenByCategoryAndLocation
    ,getServicemenByLocation
     } = require('../controller/servicedetailcontroller');
const upload = require('../middleware/upload');

router.post('/createdetail', upload.single('image'), createServiceDetail);
router.get('/getsepecificserviceman/:servicemanId', getServiceDetailByServiceManId);
router.put('/update/:servicemanId', upload.single('image'), updateServiceDetail);
router.get('/getserviceman', getServicemenByCategoryAndLocation);
router.get('/allserviceman/by-location', getServicemenByLocation);

module.exports = router;
