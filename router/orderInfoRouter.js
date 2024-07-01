const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
router.currentService = ServiceFactory.createOrderInfoService();
module.exports = router;
