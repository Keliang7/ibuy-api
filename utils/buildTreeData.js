/**
 * 生成树形结构
 * @param {Array} list
 * @param {number} parent_id
 */
const buildTreeData = (list, parent_id) => {
  const arr = [];
  for (let item of list) {
    if (item.parent_id === parent_id) {
      item.children = buildTreeData(list, item.id);
      arr.push(item);
    }
  }
  return arr;
};

module.exports = buildTreeData;
