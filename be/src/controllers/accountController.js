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
        code: StatusCodes.BAD_REQUEST,
        msg: '缺少必要字段: name 和 currency 是必需的',
        data: {}
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
      balance: parseFloat(newAccount.balance),
      created_at: newAccount.created_at
    };

    return res.status(StatusCodes.CREATED).json({
      code: StatusCodes.CREATED,
      msg: 'Account create successfully.',
      data: responseData
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: '创建账户失败',
      data: error.message
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
        code: StatusCodes.NOT_FOUND,
        msg: `未找到 ID 为 ${id} 的账户`,
        data: {}
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

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: '获取账户信息成功',
      data: responseData
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: '获取账户失败',
      data: error.message
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
        code: StatusCodes.NOT_FOUND,
        msg: `未找到 ID 为 ${id} 的账户`,
        data: {}
      });
    }

    await account.destroy();

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      msg: 'Account deleted successfully.',
      data: {}
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      msg: '删除账户失败',
      data: error.message
    });
  }
};

module.exports = {
  createAccount,
  getAccountById,
  deleteAccount
};  