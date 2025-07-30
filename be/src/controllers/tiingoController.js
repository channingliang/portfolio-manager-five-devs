const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { readFileAndSearch } = require("../data/search");

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
    const token = "6a73f169fce9bc4cfc47c3b08feb93007875ed82";
    const baseURL = `https://api.tiingo.com/tiingo/daily/${ticker}/prices`;
    const url = `${baseURL}?startDate=${startDate.slice(0, 10)}&endDate=${endDate.slice(0, 10)}&token=${token}`;

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

module.exports = {
  getTiingoData
};

