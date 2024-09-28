/**
 * 数据表admin_info的操作
 */
const BaseService = require("./BaseService");
const md5 = require("md5");
const APPConfig = require("../config/APPConfig");
const PageList = require("../model/PageList");

class AdminInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.admin_info;
  }

  /**
   * 新增管理员
   * @param {obj} obj
   * @returns {Promise<boolean>}
   */
  async add(obj) {
    //第一步：判断当前账号是否存在
    let flag = await this.existsAccount(obj.account);
    if (flag) {
      //第三步：账号存在
      throw new Error("账号已存在");
    } else {
      //第二步：账号不存在，新增
      obj.password = md5(obj.password + APPConfig.md5Salt);
      return super.add(obj);
    }
  }

  /**
   * 管理员登录
   * @param {{account:string,password:string}} param0
   * @returns {Promise<object | undefined>}
   */
  async checkLogin({ account, password }) {
    //这里的密码你要加密
    password = md5(password + APPConfig.md5Salt);
    let sql = `select * from ${this.currentTable} where is_del = false and account = ? and password = ?`;
    let result = await this.executeSql(sql, [account, password]);
    return result[0];
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
   * 分页查询管理员信息】
   * @name getListByPage
   * @param {{account:string,email:string,pageIndex:number}} param0
   * @returns {PageList} 分页查询的结果
   */
  async getListByPage({ account, email, pageIndex = 1 }) {
    let [listData, total_count] = await this.createQuery()
      .like("account", account)
      .like("email", email)
      .setPageIndex(pageIndex)
      .getPageAndCount();
    return new PageList(pageIndex, total_count, listData);
  }

  /**
   * 分页查询管理员信息【过时】
   * @deprecated 当前这个方法已经过时，请使用getListByPage的方法
   * @name getListByPage2
   * @param {{account:string,email:string,pageIndex:number}} param0
   * @returns {PageList} 分页查询的结果
   */
  async getListByPage2({ account, email, pageIndex = 1 }) {
    //第一步：准备基础的sql语句
    let sql1 = `select * from ${this.currentTable} where is_del = false `;
    let sql2 = `select count(*) total_count from ${this.currentTable} where is_del = false `;

    //第二步：动态拼接查询条件
    let { strWhere, params } = this.paramsInit()
      .like("account", account)
      .like("email", email);
    //第三步：动态拼接分页条件
    sql1 += strWhere + ` limit ${(pageIndex - 1) * 10} , 10 `;
    sql2 += strWhere;
    //第四步：执行数据库事务
    let arr = [
      { sql: sql1, params },
      { sql: sql2, params },
    ];
    let [listData, [{ total_count }]] = await this.executeTransaction(arr);

    return new PageList(pageIndex, total_count, listData);
  }

  /**
   * 查询数据，准备导出excel
   * @param {{account:string,email:string}} param0
   * @returns {Promise<Array>} 返回查询结果
   */
  exportToExcel({ account, email }) {
    let sql = ` select * from ${this.currentTable} where is_del = false `;
    let { strWhere, params } = this.paramsInit()
      .like("account", account)
      .like("email", email);

    sql += strWhere;
    return this.executeSql(sql, params);
  }

  /**
   * 修改管理员密码
   * @param {{account:string,newPassword:string,oldPassword:string}} param0
   * @returns {Promise<boolean>} true修改成功  false修改失败
   */
  async updateAdminPwd({ account, newPassword, oldPassword }) {
    // 第一步：判断旧密码是否正确
    let result1 = await this.checkLogin({ account, password: oldPassword });
    if (result1) {
      //旧密码正确
      //第二步：加新密码做md5处理
      newPassword = md5(newPassword + APPConfig.md5Salt);
      let sql = ` update ${this.currentTable} set password = ? where account = ? and is_del = false `;
      let result2 = await this.executeSql(sql, [newPassword, account]);
      return result2.affectedRows > 0;
    } else {
      //旧密码不正确
      throw new Error("旧密码不正确");
    }
  }

  /**
   * 根据账号去查询信息
   * @param {string} account
   * @returns {Promise<object> | undefined}
   */
  async findByAccount(account) {
    let sql = `select * from ${this.currentTable} where account = ? and is_del = false `;
    let result = await this.executeSql(sql, [account]);
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

module.exports = AdminInfoService;
