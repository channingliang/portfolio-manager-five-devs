const db = require("../models");
const Cash = db.Cash;
const Account = db.Account;
const sequelize = db.sequelize; // 假设Sequelize实例已导出

// 验证金额是否为有效正数
const isValidAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

const createCashTransaction = async (req, res, type) => {
  let transaction;
  try {
    // 开始数据库事务
    transaction = await sequelize.transaction();
    
    const { account_id, amount, description } = req.body;

    // 基础字段校验
    if (!account_id || !amount) {
      throw new Error("Missing required fields.");
    }

    // 金额有效性校验
    if (!isValidAmount(amount)) {
      throw new Error("金额必须是大于0的有效数字");
    }

    // 1. 查询账户是否存在（注意：account_id 实际对应 Account.user_id）
    const account = await Account.findOne({ 
      where: { user_id: account_id },
      transaction // 传递事务对象
    });

    if (!account) {
      throw new Error("用户不存在。");
    }

    // 2. 处理存取款逻辑
    let newBalance;
    let transactionType;
    if (type === 1) {
      // 存款：加钱
      newBalance = parseFloat(account.balance) + parseFloat(amount);
      transactionType = "存款";
    } else if (type === 2) {
      // 支出：扣钱，判断余额是否足够
      const currentBalance = parseFloat(account.balance);
      const transactionAmount = parseFloat(amount);
      
      if (currentBalance < transactionAmount) {
        throw new Error("余额不足，无法完成支出。");
      }
      
      newBalance = currentBalance - transactionAmount;
      transactionType = "支出";
    } else {
      throw new Error("非法交易类型。");
    }

    // 3. 更新账户余额
    account.balance = newBalance;
    await account.save({ transaction });

    // 4. 创建交易记录
    const cashRecord = await Cash.create({
      account_id,
      type,
      amount,
      related_id: 0,
      description,
      occurred_at: new Date(),
    }, { transaction });

    // 提交事务
    await transaction.commit();

    // 5. 构建响应数据
    const responseData = {
      transaction_id: cashRecord.cash_account_id,
      account_id: cashRecord.account_id,
      type: cashRecord.type,
      amount: cashRecord.amount,
      description: cashRecord.description,
      occurred_at: cashRecord.occurred_at,
      current_balance: newBalance
    };

    return res.status(201).json({
      code: 201,
      msg: `${transactionType}交易成功`,
      data: responseData
    });
  } catch (err) {
    // 回滚事务
    if (transaction) await transaction.rollback();
    
    console.error("Cash transaction error:", err);
    
    // 统一错误响应处理
    const errorMap = {
      "Missing required fields.": 400,
      "金额必须是大于0的有效数字": 400,
      "用户不存在。": 404,
      "余额不足，无法完成支出。": 400,
      "非法交易类型。": 400
    };
    
    const statusCode = errorMap[err.message] || 500;
    const errorData = statusCode === 500 ? err.message : {};
    
    return res.status(statusCode).json({
      code: statusCode,
      msg: err.message || "服务器内部错误。",
      data: errorData
    });
  }
};

exports.getCashTransactionsByAccount = async (req, res) => {
  try {
    const account_id = parseInt(req.params.account_id);

    if (isNaN(account_id)) {
      return res.status(400).json({
        code: 400,
        msg: "无效的账户 ID。",
        data: {}
      });
    }

    // 检查账户是否存在
    const account = await Account.findOne({ where: { user_id: account_id } });
    if (!account) {
      return res.status(404).json({
        code: 404,
        msg: "用户不存在。",
        data: {}
      });
    }

    // 查询交易记录
    const transactions = await Cash.findAll({
      where: { account_id },
      attributes: [
        "cash_account_id",
        "type",
        "amount",
        "description",
        "occurred_at"
      ],
      order: [["occurred_at", "DESC"]]
    });

    return res.status(200).json({
      code: 200,
      msg: "获取交易记录成功",
      data: transactions
    });
  } catch (err) {
    console.error("查询交易记录失败:", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器内部错误。",
      data: err.message
    });
  }
};

exports.depositCash = (req, res) => createCashTransaction(req, res, 1);
exports.spendCash = (req, res) => createCashTransaction(req, res, 2);  