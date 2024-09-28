/**
 * app加载路由管理对象的方法
 */
const fs = require("fs");
const path = require("path");
const ResultJson = require("../model/ResultJson");
const loadRoutes = app => {
  let arr = fs.readdirSync(path.join(__dirname, "../router"));
  for (const item of arr) {
    let router = require(path.join(__dirname, "../router", item));
    buildBaseRouterHandler(router);
    app.use(`/${item.replace("Router.js", "")}`, router);
  }
};
/**
 * 生成每个路由里面基本的增删除查请求
 * @param {import("express").Router &{currentService:import("../services/BaseService")}} router
 */
const buildBaseRouterHandler = router => {
  if (router.currentService) {
    //增
    router.post("", async (req, resp) => {
      let result = await router.currentService.add(req.body);
      let flag = result.affectedRows > 0;
      resp.json(new ResultJson(flag, flag ? "新增成功" : "新增失败", result));
    });
    //删
    router.delete("", async (req, resp) => {
      let result = await router.currentService.deleteById(req.body);
      let flag = result.affectedRows > 0;
      resp.json(new ResultJson(flag, flag ? "删除成功" : "删除失败", result));
    });
    //改
    router.put("", async (req, resp) => {
      let update = req.body;
      let id = req.params.id;
      let result = await router.currentService.update({
        ...update,
        id,
      });
      let flag = result.affectedRows > 0;
      resp.json(new ResultJson(flag, flag ? "更改成功" : "更改失败", result));
    });
    //分页查询
    router.get("", async (req, resp) => {
      let result = await router.currentService.getListByPage(req.query);
      let flag = Boolean(result);
      resp.json(new ResultJson(flag, flag ? "查询成功" : "查询失败", result));
    });
    //查id
    router.get("/:id", async (req, resp) => {
      let result = await router.currentService.findById(req.params.id);
      let flag = result.length;
      resp.json(new ResultJson(flag, flag ? "查询成功" : "查询失败", result));
    });
    //查所有
    router.get("allList", async (req, resp) => {
      let result = await router.currentService.getAllList();
      let flag = result.length > 0;
      resp.json(new ResultJson(flag, flag ? "查询成功" : "查询失败", result));
    });
  }
};

module.exports = loadRoutes;
