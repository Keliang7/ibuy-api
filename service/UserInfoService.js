/**
 * 路由userInfo引用的服务
 */
const BaseService = require("./BaseService");
const APPConfig = require("../config/APPConfig");
const md5 = require("md5");
class UserInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.user_info;
  }
  async add({ account, password, tele, nick_name, avatar, email }) {
    let sql1 = `insert into ${this.currentTable} (account,password,tele,nick_name,avatar,email,c_time) values (?,?,?,?,?,?,?)`;
    let params1 = [
      account,
      md5(password + APPConfig.md5Salt),
      tele,
      nick_name,
      avatar,
      email,
      new Date(),
    ];
    let isExists = await this.existsAccount(account);
    if (isExists) {
      console.log(isExists);
      return "账号已存在";
    } else {
      let result = await this.executeSql(sql1, [...params1]);
      return result;
    }
  }
  /**
   * 判断账号是否存在
   * @param {string} account
   * @returns {Promise<boolean>} true存在,false不存在
   */
  async existsAccount(account) {
    let sql = `select * from ${this.currentTable} where is_del  = false and account = ?`;
    let result = await this.executeSql(sql, [account]);
    return result.length > 0;
  }
  /**
   * 后台用户登录
   * @param {{account:string,password:string}} param0
   * @returns {Promise<Object | undefined>}
   */
  async checkLogin({ account, password }) {
    password = md5(password + APPConfig.md5Salt);
    let sql = `select * from ${this.currentTable} where account =? and password =? and is_del = false`;
    let result = await this.executeSql(sql, [account, password]);
    return result[0];
  }
  /**
   * 事务修改密码，再删除random_temp里面的记录
   * @param {number} id
   * @param {string} password
   * @param {string} random_temp
   * @returns
   */
  updatePasswordByRandomTemp(id, password, random_temp) {
    let sql1 = `update ${this.tableMap.admin_info} set password = ? where is_del = false and id =  ? `;
    let params1 = [password, id];
    let sql2 = `update ${this.tableMap.forgetpassword} set is_del = true where random_temp = ? `;
    let params2 = [random_temp];
    return this.executeTransaction([
      { sql: sql1, params: params1 },
      { sql: sql2, params: params2 },
    ]);
  }
}
module.exports = UserInfoService;
/* 
  新增   判断账号是否存在
  登陆
  修改密码
*/
