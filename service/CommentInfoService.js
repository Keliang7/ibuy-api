/**
 * 路由userInfo引用的服务
 */
const PageList = require("../model/PageList");
const BaseService = require("./BaseService");
class CommentInfoService extends BaseService {
  constructor() {
    super();
    this.currentTable = this.tableMap.comment_info;
  }
}
module.exports = CommentInfoService;
