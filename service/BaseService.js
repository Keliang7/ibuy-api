/**
 * 所有Service对象的公共父级对象
 */
const DBUtils = require("../utils/DBUtils");
class BaseService extends DBUtils {
  constructor() {
    super();
    this.tableMap = {
      user_info: "user_info",
      role_info: "role_info",
      permission_info: "permission_info",
      user_role_info: "user_role_info",
      role_permission_info: "role_permission_info",
      goods_info: "goods_info",
      goods_option_info: "goods_option_info",
      goods_class_info: "goods_class_info",
      user_address_info: "user_address_info",
      shopping_car_info: "shopping_car_info",
      order_info: "order_info",
      order_detail_info: "order_detail_info",
      comment_info: "comment_info",
    };
    this.currentTable = "";
  }
  /**
   *
   * @param {Object} obj
   * @returns {Object} 查询的结果
   */
  async add(obj) {
    let keys = Object.keys(obj);
    let values = Object.values(obj);
    let sql = `insert into ${this.currentTable} (${keys.join(
      ","
    )},c_time) values (${new Array(keys.length)
      .fill("?")
      .join(",")},"${new Date().toLocaleString().replaceAll("/", "-")}")`;
    let result = await this.executeSql(sql, values);
    return result;
  }
  /**
   * @description 删除
   * @param {string} ids
   * @returns {Object} 执行的结果
   */
  async deleteById(ids) {
    const placeholders = ids.map(() => "?").join(",");
    let sql = `update ${this.currentTable} set is_del = true where id IN (${placeholders}) `;
    let result = await this.executeSql(sql, ids);
    return result;
  }
  /**
   * @description 修改
   * @param {Object} obj
   * @returns {Object} 执行的结果
   */
  async update(obj) {
    let sql = `update ${this.currentTable} set u_time = ?`;
    let params = [new Date()];
    for (let property in obj) {
      if (property === "id") {
        continue;
      }
      sql += `,${property} = ?`;
      params.push(obj[property]);
    }
    sql += ` where id = ? and is_del = false`;
    params.push(obj.id);
    let result = await this.executeSql(sql, params);
    return result;
  }
  //查
  async findById(id) {
    let sql = `select * from ${this.currentTable} where id = ? and is_del = false`;
    let result = await this.executeSql(sql, [id]);
    return result;
  }
  //查所有
  async getAllList() {
    let sql = `select * from ${this.currentTable} where is_del = false `;
    return this.executeSql(sql);
  }
  //分页查询
  async getListByPage({
    pageIndex = 1,
    pageSize = 10,
    id = "",
    c_time = "",
    u_time = "",
    ...other
  }) {
    let baseSql = `select * from ${this.currentTable} where is_del = false`;
    // 构建模糊查询条件
    const likeConditions = [];
    for (const key in other) {
      if (other.hasOwnProperty(key)) {
        likeConditions.push(`${key} LIKE '%${other[key]}%'`);
      }
    }

    if (likeConditions.length > 0) {
      baseSql += ` AND ${likeConditions.join(" AND ")}`;
    }
    let listSql =
      baseSql + ` LIMIT ${pageSize} OFFSET ${(pageIndex - 1) * pageSize} `;
    let totalSql = ` SELECT COUNT(*) AS total FROM (${baseSql}) list `;

    let list = await this.executeSql(listSql);
    let total = await this.executeSql(totalSql);
    return { list, ...total[0] };
  }
  //分页
  createQuery(tableName = this.currentTable) {
    const that = this;
    let obj = {
      listSql: ` select ${tableName}.* `,
      countSql: ` select count(*) total_count from ${tableName} where ${tableName}.is_del = false `,
      from: ` from ${tableName} `,
      where: ` where ${tableName}.is_del = false `,
      pageIndex: 1,
      orderByStr: "",
      innerJoinStr: "",
      innerJoinFields: [],
      strWhere: "",
      params: [],
      innerJoin(targetTableName, onCondition) {
        this.innerJoinStr += ` inner join ${targetTableName} on ${onCondition} `;
        return this;
      },
      addField(field) {
        this.innerJoinFields.push(field);
        return this;
      },
      equal(key, value) {
        if (value) {
          this.strWhere += ` and ${key} = ?`;
          this.params.push(value);
        }
        return this;
      },
      like(key, value) {
        if (value) {
          this.strWhere += ` and ${key} like ?`;
          this.params.push(`%${value}%`);
        }
        return this;
      },
      gt(key, value) {
        if (value) {
          this.strWhere += ` and ${key} > ?`;
          this.params.push(`value`);
        }
        return this;
      },
      lt(key, value) {
        if (value) {
          this.strWhere += ` and ${key} < ?`;
          this.params.push(`value`);
        }
        return this;
      },
      gte(key, value) {
        if (value) {
          this.strWhere += ` and ${key} >= ?`;
          this.params.push(`value`);
        }
        return this;
      },
      lte(key, value) {
        if (value) {
          this.strWhere += ` and ${key} <= ?`;
          this.params.push(`value`);
        }
        return this;
      },
      ////查询的时候查哪一页
      setPageIndex(pageindex) {
        this.pageIndex = pageindex;
        return this;
      },
      /**
       * 设置排序方式
       * @param {string} columnName
       * @param {"asc"|"desc"} orderType
       */
      orderBy(columnName, orderType = "asc") {
        this.orderByStr = ` order by ${columnName} ${orderType}`;
        return this;
      },
      setListSql(listSql) {
        this.listSql = listSql;
        return this;
      },
      setCountSql(countSql) {
        this.countSql = countSql;
        return this;
      },
      async getPageAndCount() {
        // 第一步:拼接SQL
        let sql1 =
          this.listSql +
          (this.innerJoinFields.length > 0 ? "," : "") +
          this.innerJoinFields.join(",") +
          this.from +
          this.innerJoinStr +
          this.where +
          this.strWhere +
          this.orderByStr +
          ` limit ${(this.pageIndex - 1) * 10} , 10 `;
        let sql2 = this.countSql + this.strWhere; // 第二步:准备执行事务
        let arr = [
          {
            sql: sql1,
            params: this.params,
          },
          {
            sql: sql2,
            params: this.params,
          },
        ];
        //第三步:开始执行
        let [listData, [{ total_count }]] = await that.executeTransaction(arr);
        return [listData, total_count];
      },
    };
    return obj;
  }
}
module.exports = BaseService;
