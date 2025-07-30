const db = require("../models");
const { StatusCodes } = require("http-status-codes");
const { join } = require("node:path");
const fs = require("fs");
const path = require("path");
const Cash = db.Cash;
const Account = db.Account;
const sequelize = db.sequelize;

// 验证金额是否为有效正数
const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// 统一的创建现金交易函数
exports.createCashTransaction = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const { account_id, type, amount, description } = req.body;

    // 基础字段校验
    if (!account_id || !type || !amount) {
      throw new Error("Missing required fields.");
    }

    // 金额有效性校验
    if (!isValidAmount(amount)) {
      throw new Error("金额必须是大于0的有效数字");
    }

    // 交易类型校验
    if (type !== 1 && type !== 2) {
      throw new Error("非法交易类型。");
    }

    // 查询账户
    const account = await Account.findOne({
      where: { account_id: account_id },
      transaction,
    });

    if (!account) {
      throw new Error("用户不存在。");
    }

    // 处理存取款逻辑
    let newBalance;
    if (type === 1) {
      newBalance = parseFloat(account.balance) + parseFloat(amount);
    } else if (type === 2) {
      const currentBalance = parseFloat(account.balance);
      const transactionAmount = parseFloat(amount);

      if (currentBalance < transactionAmount) {
        throw new Error("余额不足，无法完成支出。");
      }

      newBalance = currentBalance - transactionAmount;
    }

    // 更新账户余额
    account.balance = newBalance;
    await account.save({ transaction });

    // 创建交易记录（related_id 设为 null）
    const cashRecord = await Cash.create(
      {
        account_id,
        type,
        amount,
        related_id: null, // 允许为空
        description,
        occurred_at: new Date(),
        balance_after: newBalance,
      },
      { transaction },
    );

    await transaction.commit();

    // 构建响应数据
    const responseData = {
      cash_transaction_id: cashRecord.cash_transaction_id,
      account_id: cashRecord.account_id,
      type: cashRecord.type,
      amount: cashRecord.amount,
      related_id: cashRecord.related_id, // 返回 null
      description: cashRecord.description,
      occurred_at: cashRecord.occurred_at,
      balance_after: cashRecord.balance_after,
    };

    return res.status(201).json({
      code: 201,
      msg: "Cash transaction created successfully.",
      data: responseData,
    });
  } catch (err) {
    if (transaction) await transaction.rollback();

    console.error("Cash transaction error:", err);

    const errorMap = {
      "Missing required fields.": 400,
      金额必须是大于0的有效数字: 400,
      "用户不存在。": 404,
      "余额不足，无法完成支出。": 400,
      "非法交易类型。": 400,
    };

    const statusCode = errorMap[err.message] || 500;
    const errorData = statusCode === 500 ? err.message : {};

    return res.status(statusCode).json({
      code: statusCode,
      msg: err.message || "服务器内部错误。",
      data: errorData,
    });
  }
};

// 获取现金交易记录
exports.getCashTransactions = async (req, res) => {
  try {
    const account_id = parseInt(req.query.account_id);

    if (isNaN(account_id)) {
      return res.status(400).json({
        code: 400,
        msg: "无效的账户 ID。",
        data: {},
      });
    }

    const account = await Account.findOne({
      where: { account_id: account_id },
    });
    if (!account) {
      return res.status(404).json({
        code: 404,
        msg: "用户不存在。",
        data: {},
      });
    }

    const transactions = await Cash.findAll({
      where: { account_id },
      attributes: [
        "cash_transaction_id",
        "account_id",
        "type",
        "amount",
        "related_id",
        "description",
        "occurred_at",
        "balance_after",
      ],
      order: [["occurred_at", "DESC"]],
    });

    const responseTransactions = transactions.map((transaction) => ({
      cash_transaction_id: transaction.cash_transaction_id,
      account_id: transaction.account_id,
      type: transaction.type,
      amount: transaction.amount,
      related_id: transaction.related_id,
      description: transaction.description,
      occurred_at: transaction.occurred_at,
      balance_after: transaction.balance_after,
    }));

    return res.status(200).json({
      code: 200,
      msg: "Cash transactions retrieved successfully.",
      data: responseTransactions,
    });
  } catch (err) {
    console.error("查询交易记录失败:", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器内部错误。",
      data: err.message,
    });
  }
};

// // 获取现金分布
// exports.getCashDistribution = async (req, res) => {
//   try {
//     const account_id = parseInt(req.query.account_id);
//
//     if (isNaN(account_id)) {
//       return res.status(400).json({
//         code: 400,
//         msg: "无效的账户 ID。",
//         data: {},
//       });
//     }
//
//     const account = await Account.findOne({ where: { account_id: account_id } });
//     if (!account) {
//       return res.status(404).json({
//         code: 404,
//         msg: "用户不存在。",
//         data: {},
//       });
//     }
//
//     // 实际项目中需要根据业务逻辑计算分布
//     const distribution = [
//       { name: "Cash", value: 40 },
//       { name: "Stock", value: 30 },
//       // 其他资产类型...
//     ];
//
//     return res.status(200).json({
//       code: 200,
//       msg: "Cash distribution retrieved successfully.",
//       data: distribution,
//     });
//   } catch (err) {
//     console.error("获取现金分布失败:", err);
//     return res.status(500).json({
//       code: 500,
//       msg: "服务器内部错误。",
//       data: err.message,
//     });
//   }
// };
// ticker_type 映射
const typeNameMap = {
  1: "Stock",
  2: "Crypto",
  3: "ETF",
  4: "Fund",
  // 可扩展
};

exports.getCashSummary = async (req, res) => {
  try {
    const account_id = Number(
      req.query.account_id || (req.body && req.body.account_id),
    );
    if (!account_id || isNaN(account_id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Valid account_id is required.",
      });
    }

    // 1. 查询账户余额
    const account = await db.Account.findByPk(account_id);
    const cash = account ? Number(account.balance) : 0;

    // 2. 查询所有 portfolio_transaction
    const txs = await db.PortfolioTransaction.findAll({
      where: { account_id },
    });

    // 3. 按 ticker_type 分类累计买入成本
    const costMap = {};
    for (const tx of txs) {
      if (tx.transaction_type === 1) {
        // 只统计买入
        const type = tx.ticker_type;
        const total = Number(tx.total_amount);
        if (!costMap[type]) costMap[type] = 0;
        costMap[type] += total;
      }
    }

    // 4. 构造返回数据
    const data = [{ name: "Cash", value: Number(cash.toFixed(2)) }];

    // 只将实际有投入的类型塞进去
    for (const [type, value] of Object.entries(costMap)) {
      data.push({
        name: typeNameMap[type] || `Type${type}`,
        value: Number(value.toFixed(2)),
      });
    }

    // 随机生成其它类型数据（如果本来没有）
    const needFakeTypes = [2, 3, 4].filter(
      (t) => !data.find((d) => d.name === typeNameMap[t]),
    );
    for (const t of needFakeTypes) {
      data.push({
        name: typeNameMap[t],
        value: Math.floor(Math.random() * 9000 + 1000), // 1000~10000 随机
      });
    }

    return res.status(StatusCodes.OK).json({
      code: 200,
      msg: "Cash distribution retrieved successfully.",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      msg: "Server error.",
    });
  }
};
