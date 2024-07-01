/**
 * 路由userInfo引用的服务
 */
const BaseService = require("./BaseService");
const PageList = require("../model/PageList");
class GoodsInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.goods_info;
  }
}
module.exports = GoodsInfoService;
