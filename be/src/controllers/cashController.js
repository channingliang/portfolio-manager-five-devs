const db = require("../models");
const Cash = db.Cash;
const Account = db.Account;

const createCashTransaction = async (req, res, type) => {
  try {
    const { account_id, amount, description } = req.body;

    if (!account_id || !amount) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 1. 查询账户是否存在（注意：account_id 实际对应 Account.user_id）
    const account = await Account.findOne({ where: { user_id: account_id } });

    if (!account) {
      return res.status(404).json({ error: "用户不存在。" });
    }

    // 2. 处理存取款逻辑
    let newBalance;
    if (type === 1) {
      // 存款：加钱
      newBalance = parseFloat(account.balance) + parseFloat(amount);
    } else if (type === 2) {
      // 支出：扣钱，判断余额是否足够
      if (parseFloat(account.balance) < parseFloat(amount)) {
        return res.status(400).json({ error: "余额不足，无法完成支出。" });
      }
      newBalance = parseFloat(account.balance) - parseFloat(amount);
    } else {
      return res.status(400).json({ error: "非法交易类型。" });
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

    return res.status(201).json(transaction);
  } catch (err) {
    console.error("Cash transaction error:", err);
    return res.status(500).json({ error: "服务器内部错误。" });
  }
};

exports.depositCash = (req, res) => createCashTransaction(req, res, 1);
exports.spendCash = (req, res) => createCashTransaction(req, res, 2);
