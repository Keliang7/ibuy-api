const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
router.currentService = ServiceFactory.createOrderDetailInfoService();
module.exports = router;
