const BaseService = require("./BaseService");
class OrderDetailInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.order_detail_info;
  }
}
module.exports = OrderDetailInfoService;
