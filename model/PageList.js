/**
 * 分页查询以后返回给前端的结果
 */

class PageList {
  constructor(total_count, listData) {
    this.total = total_count;
    this.list = listData;
  }
}

module.exports = PageList;
