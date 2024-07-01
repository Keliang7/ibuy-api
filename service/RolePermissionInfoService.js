const BaseService = require("./BaseService");
const PageList = require("../model/PageList");
class RolePermissionInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.role_permission_info;
  }
  getPermissionListByRoleId(role_id) {
    let sql = `SELECT * from ${this.currentTable} where is_del = false and role_id = ?`;
    return this.executeSql(sql, [role_id]);
  }
  savePermission(role_id, permissionIdList) {
    let arr = [];
    arr.push({
      sql: `update ${this.currentTable} set is_del = true, update_at = ? where role_id = ? `,
      params: [new Date(), role_id],
    });
    permissionIdList.forEach(permissionId => {
      arr.push({
        sql: `insert into ${this.currentTable} (role_id,permission_id,create_at) value (?,?,?)`,
        params: [role_id, permissionId, new Date()],
      });
    });
    // for (const permissionId of permissionIdList) {
    //   arr.push({
    //     sql: `insert into ${this.currentTable} (role_id,permission_id,create_at) value (?,?,?)`,
    //     params: [role_id, permissionId, new Date()],
    //   });
    // }
    return this.executeTransaction(arr);
  }
}
module.exports = RolePermissionInfoService;
