const BaseService = require("./BaseService");
class OrderInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.order_info;
  }
}
module.exports = OrderInfoService;
