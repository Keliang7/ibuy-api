const express = require("express");
const router = express.Router();
const ServiceFactory = require("../factory/ServiceFactory");
const ResultJson = require("../model/ResultJson");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
// const jwt = require("jsonWebtoken");
const APPConfig = require("../config/APPConfig");
router.currentService = ServiceFactory.createUserInfoService();
//增
router.post("", async (req, resp) => {
  const base64 = req.body.avatar;
  //这里一定要将base64进行裁剪 ，nodejs不需要前面的东西
  let base64Str = base64.replace(/^data:image\/\w+;base64,/, "");
  let fileName = uuidv4() + ".png";
  fs.writeFileSync(
    path.join(__dirname, "../upload/avatar", fileName),
    base64Str,
    "base64"
  );
  let res = await ServiceFactory.createUserInfoService().add({
    ...req.body,
    avatar: `/upload/avatar/${fileName}`,
  });
  let flag = typeof res === "object";
  resp.json(new ResultJson(flag, flag ? "添加成功" : "账号已存在"));
});
//改
router.put("", async (req, res) => {
  let { avatar } = req.body;
  if (!avatar.startsWith("/upload/avatar/")) {
    console.log("走了里面");
    // 先删除旧的头像
    let oldAvatar = await ServiceFactory.createUserInfoService()
      .findById(req.body.id)
      .then(item => item.avatar);
    if (oldAvatar && oldAvatar.startsWith("/upload/avatar/")) {
      fs.unlinkSync(path.join(__dirname, "../", oldAvatar));
    }
    // 再将 base64 写入文件
    const base64Str = avatar.replace(/^data:image\/\w+;base64,/, "");
    const fileName = uuidv4() + ".png";
    fs.writeFileSync(
      path.join(__dirname, "../upload/avatar", fileName),
      base64Str,
      "base64"
    );
    avatar = `/upload/avatar/${fileName}`;
  }
  let updateRes = await ServiceFactory.createUserInfoService().update({
    ...req.body,
    avatar,
  });
  let flag = updateRes.affectedRows > 0;
  res.json(new ResultJson(flag, flag ? "修改成功" : "修改失败"));
});
router.post("/checkLogin", async (req, resp) => {
  let result = await ServiceFactory.createUserInfoService().checkLogin(
    req.body
  );
  let flag = Boolean(result);
  if (flag) {
    Reflect.deleteProperty(result, "password");

    //得到当前用户的权限
    let permissionList =
      await ServiceFactory.createPermissionInfoService().getPermissionListByUserId(
        result.id
      );
    //只希望得到权限的所有的permission_key
    const eachPermissioniKey = list => {
      let arr = [];
      list.forEach(item => {
        arr.push(item.permission_key);
        if (item.children && Array.isArray(item.children)) {
          arr.push(...eachPermissioniKey(item.children));
        }
      });
      return arr;
    };
    let allPermissionKey = eachPermissioniKey(permissionList);
    //将得到的permission_key的集合放在result的对象上面
    result.allPermissionKey = allPermissionKey;

    //生成jwt的token
    // let token =
    //   `Bearer ` +
    //   jwt.sign(result, APPConfig.privateKey, {
    //     expiresIn: "1d",
    //   });

    resp.json(
      new ResultJson(true, "登录成功", {
        ...result,
        permissionList,
        // token,
      })
    );
  } else {
    //登录失败
    resp.json(new ResultJson(false, "用户名和密码错误，登录失败"));
  }
});

module.exports = router;
