/**
 * 路由userInfo引用的服务
 */
const BaseService = require("./BaseService");
const APPConfig = require("../config/APPConfig");
const md5 = require("md5");
const PageList = require("../model/PageList");

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
    let result = await this.executeSql(sql1, [...params1]);
    return result;
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
}
module.exports = UserInfoService;
