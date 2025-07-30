// const fs = require('fs').promises;
// const path = require('path');
// async function searchByTickerAndName(searchTerm) {
//     // 验证输入关键词
//     if (!searchTerm || typeof searchTerm !== 'string') {
//         throw new Error(' 请传入有效的搜索关键词（字符串类型）');
//     }
//     const trimmedTerm = searchTerm.trim();
//     if (trimmedTerm === '') {
//         throw new Error(' 搜索关键词不能为空或仅包含空格 ');
//     }
//     try {
//         // 1. 读取文件内容
//         const fullPath = "crypto-meta.json"
//         const fileContent = await fs.readFile(fullPath, 'utf8');
//         // 2. 解析 JSON 数据
//         const data = JSON.parse(fileContent);
//         if (!Array.isArray(data)) {
//             throw new Error(' 数据文件内容格式错误，应为数组类型 ');
//         }
//         // 3. 模糊匹配逻辑（内部辅助函数）
//         const fuzzyMatch = (item, term) => {
//             const lowerTerm = term.toLowerCase();
//             // 检查 ticker 字段（兼容 null/undefined）
//             const tickerMatch = item.ticker
//                 ? item.ticker.toLowerCase().includes(lowerTerm)
//                 : false;
//             // 检查 name 字段（兼容 null/undefined）
//             const nameMatch = item.name
//                 ? item.name.toLowerCase().includes(lowerTerm)
//                 : false;
//             return tickerMatch && nameMatch;
//         };
//         // 4. 执行搜索并返回结果
//         const matchedResults = data.filter(item => fuzzyMatch(item, trimmedTerm));
//         return matchedResults;
//     } catch (error) {
//         // 统一错误处理（区分不同错误类型）
//         if (error.code === 'ENOENT') {
//             throw new Error("文件不存在");
//         } else if (error instanceof SyntaxError) {
//             throw new Error("JSON解析失败");
//         } else {
//             throw new Error("搜索失败");
//         }
//     }
// }

// searchByTickerAndName("am");


// // 模糊搜索函数：筛选出 ticker 和 name 都包含搜索词的数据
// function fuzzySearch(data, searchTerm) {
//     if (!searchTerm || !data || !Array.isArray(data)) {
//         return [];
//     }

//     const lowerSearchTerm = searchTerm.toLowerCase();

//     return data.filter(item => {
//         const tickerMatches = item.ticker
//             ? item.ticker.toLowerCase().includes(lowerSearchTerm)
//             : false;

//         const nameMatches = item.name
//             ? item.name.toLowerCase().includes(lowerSearchTerm)
//             : false;

//         return tickerMatches && nameMatches;
//     });
// }

// // 搜索接口：接收前端查询请求
// const getDataInfo = async (req, res) => {
//     try {
//         // 获取 URL 中的查询参数
//         const searchTerm = req.params.query.trim();

//         if (!searchTerm) {
//             return res.status(400).json({
//                 code: 400,
//                 msg: ' 查询关键词不能为空 '
//             });
//         }

//         // 读取 JSON 文件
//         const filePath = "../be/src/data/crypto-meta.json"
//         const fileContent = await fs.readFile(filePath, 'utf8');
//         const data = JSON.parse(fileContent);

//         if (!Array.isArray(data)) {
//             return res.status(500).json({
//                 code: 500,
//                 msg: ' 数据格式错误，应为数组 '
//             });
//         }

//         // 执行搜索并返回结果
//         const results = fuzzySearch(data, searchTerm);


//         const responseData = {
//             query: searchTerm,
//             count: results.length,
//             results: results
//         }

//         return res.status(StatusCodes.OK).json({
//             code: StatusCodes.OK,
//             msg: `查询 ${searchTerm} 的数据成功`,
//             data: responseData
//         });

//     } catch (error) {
//         console.error(' 接口错误：', error);
//         res.status(500).json({
//             code: 500,
//             msg: ' 服务器内部错误',
//             details: error.message
//         });
//     }
// };

// module.exports = {
//     getDataInfo
// };



const fs = require('fs').promises;
const path = require('path');

// 模糊搜索函数：筛选出ticker和name都包含搜索词的数据
function fuzzySearch(data, searchTerm) {
    // 处理空输入或空数据
    if (!searchTerm || !data || !Array.isArray(data)) {
        return [];
    }

    // 将搜索词转换为小写，以便不区分大小写的匹配
    const lowerSearchTerm = searchTerm.toLowerCase();

    // 筛选数据
    return data.filter(item => {
        // 检查ticker字段是否包含搜索词
        const tickerMatches = item.ticker
            ? item.ticker.toLowerCase().includes(lowerSearchTerm)
            : false;

        // 检查name字段是否包含搜索词
        const nameMatches = item.name
            ? item.name.toLowerCase().includes(lowerSearchTerm)
            : false;

        // 只有两个字段都匹配时才返回该数据项
        return tickerMatches && nameMatches;
    });
}

// 读取文件并执行搜索的函数
async function readFileAndSearch(searchTerm) {
    try {
        // 读取文件路径
        const filePath = "crypto-meta.json"
        // 读取文件内容
        const fileContent = await fs.readFile(filePath, 'utf8');

        // 解析JSON数据
        const data = JSON.parse(fileContent);

        // 验证数据是否为数组
        if (!Array.isArray(data)) {
            throw new Error('JSON文件内容不是一个数组');
        }

        // 执行搜索
        const results = fuzzySearch(data, searchTerm);

        // 输出结果
        console.log(`搜索 '${searchTerm}' 的结果 (共 ${results.length} 条):`);
        results.forEach((item, index) => {
            console.log(`${index + 1}. Ticker: ${item.ticker}, Name: ${item.name}`);
        });

        return results;

    } catch (error) {
        console.error('处理过程中发生错误：', error.message);
        return [];
    }
}

//

/*
example
*/
// readFileAndSearch("in");
