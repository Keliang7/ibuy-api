const express = require("express");
const router = express.Router();
const ResultJson = require("../model/ResultJson");
const ServiceFactory = require("../factory/ServiceFactory");
router.currentService = ServiceFactory.createPermissionInfoService();

router.get("/getPermissionTreeData", async (req, resp) => {
  let result =
    await ServiceFactory.createPermissionInfoService().getPermissionTreeData();
  resp.json(new ResultJson(true, "获取成功", result));
});

module.exports = router;
