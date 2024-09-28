const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
const ResultJson = require("../model/ResultJson");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const upload = multer({
  dest: path.join(__dirname, "../public/goodsImg"),
});
router.currentService = ServiceFactory.createGoodsInfoService();

router.get("/", async (req, resp) => {
  const pageList = await ServiceFactory.createGoodsInfoService().getListByPage(
    req.query
  );
  pageList.list = pageList.list.map(i => ({
    ...i,
    goods_photo: i.goods_photo.split(","),
  }));
  resp.json(
    new ResultJson(!!pageList, pageList ? "查询成功" : "查询失败", pageList)
  );
});
router.post("", upload.array("goods_photo", 9), async (req, resp) => {
  let postImgList = [];
  if (req.files) {
    req.files.forEach(file => {
      let newFileName = uuidv4() + file.originalname;
      fs.renameSync(file.path, path.join(file.destination, newFileName));
      postImgList.push(`/public/goodsImg/${newFileName}`);
    });
  }
  let result = await ServiceFactory.createGoodsInfoService().add({
    ...req.body,
    goods_photo: postImgList.join(","),
  });
  let flag = result.affectedRows > 0;
  resp.json(new ResultJson(flag, flag ? "添加数据成功" : "添加数据失败"));
});
router.put("", upload.array("goods_photo", 9), async (req, resp) => {
  let oldImgStr = req.body.oldImg;
  let postImgList = [];
  if (req.files) {
    req.files.forEach(file => {
      let newFileName = uuidv4() + file.originalname;
      fs.renameSync(file.path, path.join(file.destination, newFileName));
      postImgList.push(`/public/goodsImg/${newFileName}`);
    });
  }
  console.log({
    ...req.body,
    goods_photo: `${postImgList.join(",")},${oldImgStr}`,
  });
  delete req.body.oldImg;
  let result = await ServiceFactory.createGoodsInfoService().update({
    ...req.body,
    goods_photo: `${postImgList.join(",")},${oldImgStr}`,
  });
  let temp = result.affectedRows > 0;
  resp.json(
    new ResultJson(temp ? 0 : -1, temp ? "修改数据成功" : "修改数据失败")
  );
});

module.exports = router;
