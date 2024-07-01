/**
 * 1.创建ServiceFactory.js的方法，每次启动server的时候执行一次
 * 2.node-dev忽略这个文件夹的改变，不然会一直刷新
 */

const fs = require("fs");
const path = require("path");
const buildServiceFactory = () => {
  let arr = fs.readdirSync(path.join(__dirname, "../service"));
  let contentStr = arr
    .map(item => {
      return `static create${item.replace(".js", "")}(){ 
                return Reflect.construct(require("../service/${item}"), []);
            }`;
    })
    .join("\n");

  let str = `
        class ServiceFactory {
            ${contentStr}
        }

        module.exports = ServiceFactory;
    `;
  fs.writeFileSync(path.join(__dirname, "./ServiceFactory.js"), str, "utf-8");
  console.log("ServiceFactory created successfully");
};
module.exports = buildServiceFactory;
