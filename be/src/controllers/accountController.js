
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


// 获取账户信息
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await db.Account.findByPk(id);

    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `未找到 ID 为 ${id} 的账户`
      });
    }

    const responseData = {
      user_id: account.user_id,
      name: account.name,
      currency: account.currency,
      balance: parseFloat(account.balance),
      created_at: new Date(account.getDataValue('created_at')).toISOString(),
      updated_at: account.updated_at
        ? new Date(account.getDataValue('updated_at')).toISOString()
        : null
    };

    return res.status(StatusCodes.OK).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '获取账户失败',
      error: error.message
    });
  }
};

// 删除账户
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await db.Account.findByPk(id);

    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `未找到 ID 为 ${id} 的账户`
      });
    }

    await account.destroy();

    return res.status(StatusCodes.OK).json({
      message: "Account deleted successfully."
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '删除账户失败',
      error: error.message
    });
  }
};

module.exports = {
  createAccount,
  getAccountById,
  deleteAccount
};