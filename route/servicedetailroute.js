const express = require('express');
const router = express.Router();
const { createServiceDetail,  getServiceDetailByServiceManId,updateServiceDetail } = require('../controller/servicedetailcontroller');
const upload = require('../middleware/upload');

router.post('/createdetail', upload.single('image'), createServiceDetail);
router.get('/getsepecificserviceman/:servicemanId', getServiceDetailByServiceManId);
router.put('/update/:servicemanId', upload.single('image'), updateServiceDetail);

module.exports = router;
