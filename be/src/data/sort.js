const fs = require('fs').promises;
const path = require('path');

// 读取JSON文件并按ticker排序的函数
async function readAndSortByTicker() {
    try {
        // 读取文件内容
        // const filePath = path.join(__dirname, 'response.json');
        const filePath = "response.json"
        const fileContent = await fs.readFile(filePath, 'utf8');

        // 解析JSON数据
        const data = JSON.parse(fileContent);

        // 检查数据是否为数组
        if (!Array.isArray(data)) {
            throw new Error('JSON文件内容不是一个数组');
        }

        // 按ticker字段排序（字母顺序，不区分大小写）
        const sortedData = [...data].sort((a, b) => {
            // 确保ticker字段存在
            if (!a.ticker || !b.ticker) {
                throw new Error('数据中缺少ticker字段');
            }

            const tickerA = a.ticker.toLowerCase();
            const tickerB = b.ticker.toLowerCase();

            if (tickerA < tickerB) return -1;
            if (tickerA > tickerB) return 1;
            return 0;
        });

        console.log('排序完成！');
        console.log('排序后的ticker顺序：', sortedData.map(item => item.ticker));

        // 可选：将排序后的结果写回新文件
        const outputPath = path.join(__dirname, 'sorted_response.json');
        await fs.writeFile(outputPath, JSON.stringify(sortedData, null, 2), 'utf8');
        console.log(`排序后的结果已保存到：${outputPath}`);

        return sortedData;

    } catch (error) {
        console.error('处理过程中发生错误：', error.message);
    }
}

// 执行函数
readAndSortByTicker();
