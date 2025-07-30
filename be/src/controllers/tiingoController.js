const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { readFileAndSearch } = require("../data/search");
const fs = require("fs").promises;
const path = require("path");

const TIINGO_API_KEY = "2024e73ccc9807945e3d335776aec49535858db3";
const TIINGO_BASE_URL = "https://api.tiingo.com";
// 修正路径：从Controller目录向上一级到src，再进入tiingo-data
const CACHE_DIR = path.join(__dirname, "../tiingo-data");
const CACHE_FILE = path.join(CACHE_DIR, "getEndOfDayData.json");

// 确保缓存目录存在
const ensureCacheDir = async () => {
  try {
    await fs.access(CACHE_DIR);
  } catch (error) {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  }
};

// 从缓存文件读取数据
const readCache = async () => {
  try {
    const data = await fs.readFile(CACHE_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return null; // 文件不存在或读取失败
  }
};

// 写入数据到缓存文件
const writeCache = async (data) => {
  await ensureCacheDir();
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
};

// 检查缓存是否包含今天的数据
const isCacheUpToDate = (cacheData) => {
  if (!cacheData || !cacheData.data || !cacheData.data.length) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestCacheDate = new Date(cacheData.data[0].date);
  latestCacheDate.setHours(0, 0, 0, 0);

  return today.getTime() === latestCacheDate.getTime();
};

// 计算过去一周的日期
const getLastWeekRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

// 原有的获取股票价格信息的方法
const getTiingoData = async (req, res) => {
  try {
    const { ticker, startDate, endDate, sort } = req.body;

    // 基础校验
    if (!ticker || !startDate || !endDate || !sort) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        msg: "缺少必要字段: ticker, startDate, endDate, sort 是必需的",
        data: {}
      });
    }

    // 构建请求 URL
    const baseURL = `${TIINGO_BASE_URL}/tiingo/daily/${ticker}/prices`;
    const url = `${baseURL}?startDate=${startDate.slice(0, 10)}&endDate=${endDate.slice(0, 10)}&token=${TIINGO_API_KEY}`;

    // 调用 Tiingo API
    const response = await axios.get(url);

    let data = response.data;

    // 按照 sort 排序（DESC 或 ASC）
    if (sort === "DESC") {
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "ASC") {
      data = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: "获取股票信息成功",
      data
    });

  } catch (error) {
    console.error("Tiingo API Error:", error?.response?.data || error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "获取股票信息失败",
      data: error?.response?.data || error.message
    });
  }
};

// 1. 获取日终信息 - 带本地缓存
const getEndOfDayData = async (req, res) => {
  try {
    const { ticker } = req.body;

    // 验证必填字段
    if (!ticker) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        msg: "缺少必要字段: ticker 是必需的",
        data: {}
      });
    }

    // 尝试读取缓存
    const cacheData = await readCache();

    // 如果缓存存在且是最新的，直接返回
    if (cacheData && isCacheUpToDate(cacheData)) {
      console.log("Returning cached data");
      return res.status(StatusCodes.OK).json({
        code: StatusCodes.OK,
        msg: "获取日终信息成功（缓存）",
        data: cacheData.data
      });
    }

    // 计算过去一周的日期范围
    const { startDate, endDate } = getLastWeekRange();

    // 构建请求URL
    const url = `${TIINGO_BASE_URL}/tiingo/daily/${ticker}/prices`;
    const queryParams = new URLSearchParams({
      startDate: startDate.slice(0, 10),
      endDate: endDate.slice(0, 10),
      token: TIINGO_API_KEY
    });

    // 调用Tiingo API
    const response = await axios.get(`${url}?${queryParams}`);

    // 处理响应数据
    if (!response.data || response.data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        msg: "未找到相关数据",
        data: {}
      });
    }

    // 格式化数据
    const formattedData = response.data.map(item => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close
    }));

    // 保存到缓存
    const cachePayload = {
      timestamp: new Date().toISOString(),
      data: formattedData
    };
    await writeCache(cachePayload);

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: "获取日终信息成功",
      data: formattedData
    });

  } catch (error) {
    console.error("Tiingo API Error:", error?.response?.data || error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "获取日终信息失败",
      data: error?.response?.data || error.message
    });
  }
};

// 2. 获取定义数据信息 - 修正URL路径
const getDefinitionsData = async (req, res) => {
  try {
    const { ticker } = req.body;

    // 验证必填字段
    if (!ticker) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        msg: "缺少必要字段: ticker 是必需的",
        data: {}
      });
    }

    // 修正请求URL - 使用元数据端点获取定义信息
    const url = `${TIINGO_BASE_URL}/tiingo/daily/${ticker}`;
    const queryParams = new URLSearchParams({
      token: TIINGO_API_KEY
    });

    // 调用Tiingo API
    const response = await axios.get(`${url}?${queryParams}`);

    // 处理响应数据
    if (!response.data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        msg: "未找到相关定义数据",
        data: {}
      });
    }

    // 提取并格式化相关定义数据
    const formattedData = {
      dataCode: "generalInfo",
      name: response.data.name || "General Information",
      description: response.data.description || "General information about the ticker"
    };

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: "获取定义数据信息成功",
      data: formattedData
    });

  } catch (error) {
    console.error("Tiingo API Error:", error?.response?.data || error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "获取定义数据信息失败",
      data: error?.response?.data || error.message
    });
  }
};

// 3. 获取基金概述信息 - 修正URL路径
const getFundOverview = async (req, res) => {
  try {
    const { ticker } = req.body;

    // 验证必填字段
    if (!ticker) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        msg: "缺少必要字段: ticker 是必需的",
        data: {}
      });
    }

    // 修正请求URL - 使用基金端点
    const url = `${TIINGO_BASE_URL}/tiingo/funds/${ticker}`;
    const queryParams = new URLSearchParams({
      token: TIINGO_API_KEY
    });

    // 调用Tiingo API
    const response = await axios.get(`${url}?${queryParams}`);

    // 处理响应数据
    if (!response.data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        msg: "未找到相关基金数据",
        data: {}
      });
    }

    // 格式化响应数据
    const formattedData = {
      ticker: response.data.ticker || ticker,
      name: response.data.name || "Unknown Fund Name",
      exchange: response.data.exchange || "Unknown Exchange",
      assetClass: response.data.assetClass || "Unknown Asset Class"
    };

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: "获取基金概述信息成功",
      data: formattedData
    });

  } catch (error) {
    console.error("Tiingo API Error:", error?.response?.data || error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "获取基金概述信息失败",
      data: error?.response?.data || error.message
    });
  }
};

// 4. 获取Meta Endpoint信息 - 按照文档要求返回数据
const getMetaEndpoint = async (req, res) => {
  try {
    const { ticker } = req.body;

    // 验证必填字段
    if (!ticker) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        msg: "缺少必要字段: ticker 是必需的",
        data: {}
      });
    }

    // 构建请求URL - 修正为加密货币元数据端点
    const url = `${TIINGO_BASE_URL}/tiingo/crypto/${ticker}`;
    const queryParams = new URLSearchParams({
      token: TIINGO_API_KEY
    });

    // 调用Tiingo API
    const response = await axios.get(`${url}?${queryParams}`);

    // 处理响应数据
    if (!response.data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: StatusCodes.NOT_FOUND,
        msg: "未找到相关加密货币数据",
        data: {}
      });
    }

    // 格式化并返回数据
    const formattedData = {
      ticker: response.data.ticker,
      name: response.data.name || "Crypto Asset",
      baseCurrency: response.data.baseCurrency,
      quoteCurrency: response.data.quoteCurrency,
      description: response.data.description || "No description available"
    };

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: "获取Meta Endpoint信息成功",
      data: formattedData
    });

  } catch (error) {
    console.error("Tiingo API Error:", error?.response?.data || error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: "获取Meta Endpoint信息失败",
      data: error?.response?.data || error.message
    });
  }
};

module.exports = {
  getTiingoData,
  getEndOfDayData,
  getDefinitionsData,
  getFundOverview,
  getMetaEndpoint
};
