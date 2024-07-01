const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
router.currentService = ServiceFactory.createRolePermissionInfoService();
const ResultJson = require("../model/ResultJson");

router.get("/getPermissionListByRoleId/:role_id", async (req, resp) => {
  let result =
    await ServiceFactory.createRolePermissionInfoService().getPermissionListByRoleId(
      req.params.role_id
    );
  resp.json(new ResultJson(true, "获取数据成功", result));
});
router.put(`/savePermission/:role_id`, async (req, resp) => {
  let { permissionIdList } = req.body;
  let result =
    await ServiceFactory.createRolePermissionInfoService().savePermission(
      req.params.role_id,
      permissionIdList
    );
  resp.json(new ResultJson(true, "保存成功"));
});
module.exports = router;
