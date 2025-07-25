const db = require("../models");
const Cash = db.Cash;
const Account = db.Account;

const createCashTransaction = async (req, res, type) => {
  try {
    const { account_id, amount, description } = req.body;

    if (!account_id || !amount) {
      return res.status(400).json({
        code: 400,
        msg: "Missing required fields.",
        data: {}
      });
    }

    // 1. 查询账户是否存在（注意：account_id 实际对应 Account.user_id）
    const account = await Account.findOne({ where: { user_id: account_id } });

    if (!account) {
      return res.status(404).json({
        code: 404,
        msg: "用户不存在。",
        data: {}
      });
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
      if (parseFloat(account.balance) < parseFloat(amount)) {
        return res.status(400).json({
          code: 400,
          msg: "余额不足，无法完成支出。",
          data: {}
        });
      }
      newBalance = parseFloat(account.balance) - parseFloat(amount);
      transactionType = "支出";
    } else {
      return res.status(400).json({
        code: 400,
        msg: "非法交易类型。",
        data: {}
      });
    }

    // 3. 更新账户余额
    account.balance = newBalance;
    await account.save();

    // 4. 创建交易记录
    const transaction = await Cash.create({
      account_id,
      type,
      amount,
      related_id: 0,
      description,
      occurred_at: new Date(),
    });

    // 5. 构建响应数据
    const responseData = {
      transaction_id: transaction.cash_account_id,
      account_id: transaction.account_id,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      occurred_at: transaction.occurred_at,
      current_balance: newBalance
    };

    return res.status(201).json({
      code: 201,
      msg: `${transactionType}交易成功`,
      data: responseData
    });
  } catch (err) {
    console.error("Cash transaction error:", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器内部错误。",
      data: err.message
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
      order: [["occurred_at", "ASC"]]
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
