const BaseService = require("./BaseService");
class UserAddressInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.user_address_info;
  }
}
module.exports = UserAddressInfoService;
