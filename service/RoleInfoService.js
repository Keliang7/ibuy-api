/**
 * 路由roleInfo引用的服务
 */
const BaseService = require("./BaseService");
// const PageList = require("../model/PageList");
class RoleInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.role_info;
  }
}
module.exports = RoleInfoService;
