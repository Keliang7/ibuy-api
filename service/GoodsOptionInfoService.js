/**
 * 路由userInfo引用的服务
 */
const BaseService = require("./BaseService");
class GoodsOptionInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.goods_option_info;
  }
}
module.exports = GoodsOptionInfoService;
