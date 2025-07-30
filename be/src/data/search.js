// data/search.js (修改后的代码)
const fs = require("fs").promises;
const path = require("path");

// 模糊搜索函数：筛选出ticker和name都包含搜索词的数据
function fuzzySearch(data, searchTerm) {
  if (!searchTerm || !data || !Array.isArray(data)) {
    return [];
  }

  const lowerSearchTerm = searchTerm.toLowerCase();

  return data.filter((item) => {
    const tickerMatches = item.ticker
      ? item.ticker.toLowerCase().includes(lowerSearchTerm)
      : false;

    const nameMatches = item.name
      ? item.name.toLowerCase().includes(lowerSearchTerm)
      : false;

    // 修改这里：从 && 改为 ||，只需要一个字段匹配即可
    return tickerMatches || nameMatches;
  });
}

// 读取文件并执行搜索的函数 (修改了文件路径)
async function readFileAndSearch(searchTerm) {
  try {
    // 修改为正确的stock-meta.json路径
    const filePath = path.join(__dirname, "stock-meta.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(fileContent);

    if (!Array.isArray(data)) {
      throw new Error("JSON文件内容不是一个数组");
    }

    // const results = fuzzySearch(data, searchTerm);
    return searchTerm ? fuzzySearch(data, searchTerm) : data;
  } catch (error) {
    console.error("处理过程中发生错误：", error.message);
    return [];
  }
}

module.exports = {
  readFileAndSearch,
};
