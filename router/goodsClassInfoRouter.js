const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
router.currentService = ServiceFactory.createGoodsClassInfoService();
const ResultJson = require("../model/ResultJson");

router.get("/getListByPage", async (req, resp) => {
  let pageList =
    await ServiceFactory.createGoodsClassInfoService().getListByPage(req.query);
  resp.json(new ResultJson(true, "数据获取成功", pageList));
});
module.exports = router;
