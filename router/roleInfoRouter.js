const express = require("express");
const router = express.Router();

const ServiceFactory = require("../factory/ServiceFactory");

router.currentService = ServiceFactory.createRoleInfoService();
// const ResultJson = require("../model/ResultJson");
module.exports = router;
