// controllers/market-controller.js
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { readFileAndSearch } = require("../data/search");

class MarketController {
  /**
   * 查询市场股票数据
   * @param {express.Request} req - 请求对象
   * @param {express.Response} res - 响应对象
   */
  static async getStockMarketData(req, res) {
    try {
      const { search } = req.query;
      const searchTerm = (search || "").trim();

      // 调用搜索服务获取初步结果
      const searchResults = await readFileAndSearch(searchTerm);
      if (!Array.isArray(searchResults)) {
        throw new Error("搜索结果格式错误");
      }

      // 提取唯一的ticker列表（小写格式）
      const tickers = [
        ...new Set(
          searchResults
            .map((item) => item.ticker?.toLowerCase())
            .filter(Boolean),
        ),
      ];

      // 获取股票元数据
      const stockMetaPath = path.join(__dirname, "../data/stock-meta.json");
      const stockMetaContent = await fs.readFile(stockMetaPath, "utf8");
      const stockMeta = JSON.parse(stockMetaContent);

      if (!Array.isArray(stockMeta)) {
        throw new Error("stock-meta.json格式错误");
      }

      // 构建最终响应数据
      const resultData = await Promise.all(
        tickers.map(async (ticker) => {
          const stockItem = stockMeta.find(
            (item) => item.ticker?.toLowerCase() === ticker,
          );

          if (!stockItem) return null; // 过滤未找到的条目

          // 读取日线数据文件
          const endOfDayPath = path.join(
            __dirname,
            `../data/end-of-day-${ticker}.json`,
          );

          let detail = [];
          try {
            const endOfDayContent = await fs.readFile(endOfDayPath, "utf8");
            detail = JSON.parse(endOfDayContent);
            if (!Array.isArray(detail)) detail = [];
          } catch (err) {
            console.warn(`日线数据文件不存在: ${ticker}`);
            detail = [];
          }

          return {
            ticker: stockItem.ticker.toUpperCase(),
            name: stockItem.name,
            detail,
          };
        }),
      );

      // 过滤掉空值并返回响应
      const filteredResults = resultData.filter(Boolean);

      res.status(200).json({
        code: 200,
        msg: "Stock market data retrieved successfully.",
        data: filteredResults,
      });
    } catch (error) {
      console.error("市场数据查询失败:", error);
      res.status(500).json({
        code: 500,
        msg: "Failed to retrieve stock market data.",
        details: error.message,
      });
    }
  }

  /**
   * 获取单支股票市场数据
   * @param {express.Request} req
   * @param {express.Response} res
   */
  static async getStockByTicker(req, res) {
    try {
      // ticker参数，忽略大小写
      const tickerParam = (req.params.ticker || "").toUpperCase().trim();
      if (!tickerParam) {
        return res.status(400).json({
          code: 400,
          msg: "Ticker is required.",
        });
      }

      // 读取股票元数据
      const stockMetaPath = path.join(__dirname, "../data/stock-meta.json");
      const stockMetaContent = await fs.readFile(stockMetaPath, "utf8");
      const stockMeta = JSON.parse(stockMetaContent);
      if (!Array.isArray(stockMeta)) {
        throw new Error("stock-meta.json格式错误");
      }

      // 查找目标股票
      const stockItem = stockMeta.find(
        (item) => (item.ticker || "").toUpperCase() === tickerParam,
      );
      if (!stockItem) {
        return res.status(404).json({
          code: 404,
          msg: `Stock ticker '${tickerParam}' not found.`,
        });
      }

      // 读取该ticker的日线数据
      const endOfDayPath = path.join(
        __dirname,
        `../data/end-of-day-${tickerParam.toLowerCase()}.json`,
      );
      let detail = [];
      try {
        const endOfDayContent = await fs.readFile(endOfDayPath, "utf8");
        detail = JSON.parse(endOfDayContent);
        if (!Array.isArray(detail)) detail = [];
      } catch (err) {
        console.warn(`日线数据文件不存在: ${tickerParam}`);
        detail = [];
      }

      res.status(200).json({
        code: 200,
        msg: "Stock market data retrieved successfully.",
        data: {
          ticker: stockItem.ticker.toUpperCase(),
          name: stockItem.name,
          detail,
        },
      });
    } catch (error) {
      console.error("单支股票查询失败:", error);
      res.status(500).json({
        code: 500,
        msg: "Failed to retrieve stock market data.",
        details: error.message,
      });
    }
  }
}

module.exports = MarketController;
