const BaseService = require("./BaseService");
class ShoppingCarInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.shopping_car_info;
  }
}
module.exports = ShoppingCarInfoService;
