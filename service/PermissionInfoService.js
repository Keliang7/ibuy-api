const BaseService = require("./BaseService");
const PageList = require("../model/PageList");
const buildTreeData = require("../utils/buildTreeData");
class PermissionInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.permission_info;
  }
  /**
   * 生成树形结构的数据
   * @returns  {Promise<Array>}
   */
  async getPermissionTreeData() {
    let result = await super.getAllList();
    result.forEach(item => {
      item.label = item.permission_name;
      item.value = item.id;
    });
    let list = buildTreeData(result, 0);
    return list;
  }

  /**
   * 获取某一个用户的权限
   * @param {number} user_id
   */
  async getPermissionListByUserId(user_id) {
    let sql = `select DISTINCT permission_info.* from user_role_info
        inner join role_info on user_role_info.role_id = role_info.id
        inner join role_permission_info on role_permission_info.role_id = role_info.id
        inner join permission_info on permission_info.id = role_permission_info.permission_id
        where user_role_info.user_id = ? and user_role_info.is_del = false
        and permission_info.is_del = false and role_permission_info.is_del = FALSE`;
    let result = await this.executeSql(sql, [user_id]);
    //将权限生成树形结构
    let list = buildTreeData(result, 0);
    return list;
  }
}
module.exports = PermissionInfoService;
