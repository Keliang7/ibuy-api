/**
 * 返回值对象，返回值每次返回这个特定的对象
 * code代表返回的代码，1代表本次操作是成功的，0代表本次操作是失败的
 * message代表服务器返回的消息
 * data代表服务器返回的数据
 */
class ResultJson {
  constructor(status, msg, data = {}) {
    this.code = Number(status);
    this.message = msg;
    this.data = data;
  }
}
module.exports = ResultJson;
