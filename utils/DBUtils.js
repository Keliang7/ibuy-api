/**
 * @name DBUtils
 * @version 1.0.0
 * @description 数据库操作的封装
 */

const mysql = require("mysql2");

class DBUtils {
  /**
   * 获取数据库的连接
   * @returns {mysql.Connection}
   */
  getConn() {
    /* 
        创建连接 使用createConnection（） 配置文件是一个对象
        主机名，端口，用户，密码，数据库
    */
    let conn = mysql.createConnection({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "LAq1234567",
      database: "Ibuy",
    });
    //开始连接
    conn.connect(error => {
      if (error) {
        console.log("Error connecting to database");
      } else {
        console.log("Connected to database");
      }
    });
    return conn;
  }
  /**
   * 执行SQL语句
   * @param {string} sql
   * @param {Array} params
   * @returns {Promise<Array|mysql.ResultSetHeader>} 返回SQL语句执行的结果
   */
  executeSql(sql, params = []) {
    //首先连接
    let conn = this.getConn();
    return new Promise((resolve, reject) => {
      conn.query(sql, params, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
        //执行完之后断开连接，不要占用资源
        conn.end(() => {
          console.log("finished");
        });
      });
    });
  }
  /**
   * 执行SQL事务
   * @param {Array<{sql:string,params:[]}>} sqlEnemtyList
   */
  //execute vt. 执行
  executeTransaction(sqlEntityList) {
    return new Promise((resolve, reject) => {
      //第一步开始连接
      let conn = this.getConn();

      //第二步开启事务
      conn.beginTransaction(error => {
        if (error) {
          reject(error);
          return;
        }
      });
      let arr = sqlEntityList.map(item => {
        return new Promise((sqlresolve, sqlreject) => {
          conn.query(item.sql, item.params, (err, res) => {
            if (err) {
              sqlreject(err);
            } else {
              sqlresolve(res);
            }
          });
        });
      });
      //通过promise.all()执行并发
      Promise.all(arr)
        .then(resArr => {
          //都成功我们就提交
          conn.commit();
          resolve(resArr);
        })
        .catch(error => {
          //有一个错误我们就回滚
          conn.rollback();
          reject(error);
        })
        .finally(() => conn.end()); //最后关闭数据库连接
    });
  }
  paramsInit() {
    let obj = {
      strWhere: "",
      params: [],
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
    };
    return obj;
  }
}
module.exports = DBUtils;
