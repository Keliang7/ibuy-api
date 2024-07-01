const express = require("express");
const router = express.Router();
const ResultJson = require("../model/ResultJson");
const ServiceFactory = require("../factory/ServiceFactory");
router.currentService = ServiceFactory.createUserRoleInfoService();
router.get("/getUserRoleListByUserId/:user_id", async (req, resp) => {
  let result =
    await ServiceFactory.createUserRoleInfoService().getUserRoleListByUserId(
      req.params.user_id
    );
  resp.json(new ResultJson(true, "数据获取成功", result));
});
router.put("/saveRoleData/:user_id", async (req, resp) => {
  let user_id = req.params.user_id;
  let { roleIdList } = req.body;
  let result = await ServiceFactory.createUserRoleInfoService().saveRoleData(
    user_id,
    roleIdList
  );
  resp.json(new ResultJson(true, "保存成功"));
});

module.exports = router;
