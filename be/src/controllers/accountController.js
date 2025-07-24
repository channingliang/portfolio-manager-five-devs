
const { StatusCodes } = require("http-status-codes");

const db = require('../models');

// 创建账户
const createAccount = async (req, res) => {
  try {
    // 从请求体获取数据
    const { name, currency } = req.body;
    
    // 验证必要字段
    if (!name || !currency) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: '缺少必要字段: name 和 currency 是必需的',
        error: {}
      });
    }
    
    // 创建新账户（balance默认为0.00，created_at自动设置）
    const newAccount = await db.Account.create({
      name,
      currency
    });
    
    // 构建符合要求的响应格式
    const responseData = {
      user_id: newAccount.user_id,
      name: newAccount.name,
      currency: newAccount.currency,
      balance: parseFloat(newAccount.balance), // 转换为数字格式
      created_at: newAccount.created_at // ✅ 已是格式化好的字符串
    };

    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: '账户创建成功',
      data: responseData
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '创建账户失败',
      error: error.message
    });
  }
};

module.exports = {
  createAccount,
};