const express = require("express");
require("express-async-errors");
const http = require("http");
const app = express();
const server = http.createServer(app);
const path = require("path");
const cors = require("cors");
const router = express.Router();
const bodyParser = require("body-parser");

//静态目录
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/upload", express.static(path.join(__dirname, "./upload")));
//使用cors解决跨域
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,OPTIONS",
    credentials: true,
  })
);
//bodyParser接收body的参数
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

//加载路由
require("./utils/loadRouter")(app);

const ResultJson = require("./model/ResultJson");
//全局异常处理
app.use((err, req, resp, next) => {
  console.log(err);
  resp.status(500).json(new ResultJson(false, err.message));
  next();
});
const buildServiceFactory = require("./factory/buildServiceFactory");
server.listen(3000, "0.0.0.0", () => {
  buildServiceFactory();
  console.log("started http://0.0.0.0:3000/");
});
