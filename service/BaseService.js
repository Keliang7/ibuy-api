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
   * @description 增加
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
    return await this.executeSql(sql, values);
  }
  /**
   * @description 删除
   * @param {string[]} ids
   * @returns {Object} 执行的结果
   */
  async delete(ids) {
    const placeholders = ids.map(() => "?").join(",");
    let sql = `update ${this.currentTable} set is_del = true where id IN (${placeholders}) `;
    return await this.executeSql(sql, ids);
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
    return await this.executeSql(sql, params);
  }
  /**
   * @description 通过id查询
   * @param {string} id
   * @returns {Object} 执行的结果
   */
  async findById(id) {
    let sql = `select * from ${this.currentTable} where id = ? and is_del = false`;
    return await this.executeSql(sql, [id]);
  }
  /**
   * @description 查询所有
   * @returns {Object} 执行的结果
   */
  async getAllList() {
    let sql = `select * from ${this.currentTable} where is_del = false `;
    return this.executeSql(sql);
  }
  /**
   * 根据分页条件获取列表数据
   * @async
   * @param {Object} params - 查询条件
   * @param {number} [params.pageIndex=1] - 当前页码，默认值为 1
   * @param {number} [params.pageSize=10] - 每页数据量，默认值为 10
   * @param {string} [params.id=""] - 可选的 ID 过滤条件，默认空字符串
   * @param {string} [params.c_time=""] - 可选的创建时间过滤条件，默认空字符串
   * @param {string} [params.u_time=""] - 可选的更新时间过滤条件，默认空字符串
   * @param {Object} [params.other] - 其他模糊查询条件的键值对
   * @returns {Promise<Object>} 返回包含列表和总数的对象
   * @returns {Object[]} returns.list - 查询到的数据列表
   * @returns {number} returns.total - 数据总数
   *
   * @description
   * 该函数用于通过分页条件查询数据表中的数据，支持模糊查询和分页功能。它会构建基础的 SQL 查询，并根据提供的其他条件进行筛选。
   * - 模糊查询会根据 `other` 对象中的键值对生成 SQL `LIKE` 语句。
   * - 返回的数据包含当前页的数据列表和数据总数。
   */
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
    // 按照 c_time 降序排列，确保新增的记录在第一页
    baseSql += ` ORDER BY c_time DESC`;
    // 分页查询
    let listSql =
      baseSql + ` LIMIT ${pageSize} OFFSET ${(pageIndex - 1) * pageSize}`;
    // 获取总数
    let totalSql = `SELECT COUNT(*) AS total FROM (${baseSql}) list`;
    let list = await this.executeSql(listSql);
    let total = await this.executeSql(totalSql);
    return { list, ...total[0] };
  }
  // 构建查询条件
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
      //查询的时候查哪一页
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
