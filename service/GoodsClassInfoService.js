/**
 * 路由userInfo引用的服务
 */
const PageList = require("../model/PageList");
const BaseService = require("./BaseService");
class GoodsClassInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.goods_class_info;
  }
}
module.exports = GoodsClassInfoService;
