class ResultJson {
  /**
   * 构造函数
   * @param {number} status - 状态码，0 表示成功，非 0 表示失败
   * @param {string} msg - 返回的消息
   * @param {Object} [data={}] - 可选，返回的数据，默认为空对象
   */
  constructor(status, msg, data = {}) {
    this.code = this.parseStatus(status);
    this.message = msg;
    this.data = data;
  }
  /**
   * 解析状态码
   * @param {number} status - 状态码
   * @returns {number} - 返回解析后的状态码
   */
  parseStatus(status) {
    return status ? 0 : -1; // 成功为 0，失败为 -1
  }
}

module.exports = ResultJson;
