// controllers/portfolioController.js
const { StatusCodes } = require("http-status-codes");
const db = require("../models"); // Sequelize

exports.createPortfolioTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();
  // 参数对象基本校验
  if (
    !req.body ||
    typeof req.body !== "object" ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    await t.rollback();
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: 400,
      msg: "Request body is required and should be a non-empty object.",
    });
  }
  try {
    // ==== 参数校验 ====
    const {
      account_id,
      ticker,
      ticker_type,
      transaction_type,
      quantity,
      price_per_unit,
    } = req.body;

    // 必要字段检查
    if (
      !account_id ||
      !ticker ||
      ticker_type === undefined ||
      !transaction_type ||
      quantity === undefined ||
      price_per_unit === undefined
    ) {
      await t.rollback();
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Missing required parameters.",
      });
    }
    if (
      typeof account_id !== "number" ||
      typeof ticker !== "string" ||
      typeof ticker_type !== "number" ||
      typeof transaction_type !== "number" ||
      typeof quantity !== "number" ||
      typeof price_per_unit !== "number"
    ) {
      await t.rollback();
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Invalid parameter types.",
      });
    }
    if (quantity <= 0 || price_per_unit <= 0) {
      await t.rollback();
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Quantity and price_per_unit must be positive numbers.",
      });
    }

    // 只支持买入（1）和卖出（2）
    if (![1, 2].includes(transaction_type)) {
      await t.rollback();
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Only buy (1) and sell (2) transactions are supported.",
      });
    }

    // 获取账户信息
    const acc = await db.Account.findByPk(account_id, { transaction: t });
    if (!acc) {
      await t.rollback();
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        msg: "Account not found.",
      });
    }
    const total_amount = Number(quantity) * Number(price_per_unit);
    const occurred_at = new Date();

    // ==== 买入 ====
    if (transaction_type === 1) {
      if (Number(acc.balance) < total_amount) {
        await t.rollback();
        return res.status(StatusCodes.BAD_REQUEST).json({
          code: 400,
          msg: "Insufficient balance.",
        });
      }

      // 扣钱，生成 cash transaction(type=2)
      const new_balance = Number(acc.balance) - total_amount;
      const cashTx = await db.Cash.create(
        {
          account_id,
          type: 2, // money out
          amount: total_amount,
          related_id: null,
          description: `Buy ${quantity} ${ticker} @ ${price_per_unit}`,
          occurred_at,
          balance_after: new_balance,
        },
        { transaction: t },
      );

      // 更新账户余额
      await acc.update(
        { balance: new_balance, updated_at: new Date() },
        { transaction: t },
      );

      // 生成 portfolio transaction
      const portfolioTx = await db.PortfolioTransaction.create(
        {
          account_id,
          ticker,
          ticker_type,
          transaction_type,
          quantity,
          price_per_unit,
          total_amount,
          cash_transaction_id: cashTx.cash_transaction_id,
          occurred_at,
        },
        { transaction: t },
      );

      // 更新或创建持仓
      const holding = await db.PortfolioHolding.findOne({
        where: { account_id, ticker },
        transaction: t,
      });
      if (holding) {
        await holding.update(
          {
            quantity: Number(holding.quantity) + Number(quantity),
            updated_at: new Date(),
          },
          { transaction: t },
        );
      } else {
        await db.PortfolioHolding.create(
          {
            account_id,
            ticker,
            ticker_type,
            quantity,
            created_at: new Date(),
          },
          { transaction: t },
        );
      }

      await t.commit();

      return res.status(StatusCodes.CREATED).json({
        code: 201,
        msg: "Portfolio transaction created successfully.",
        data: {
          portfolio_transaction_id: portfolioTx.portfolio_transaction_id,
          account_id,
          ticker,
          ticker_type,
          transaction_type,
          quantity: Number(quantity),
          price_per_unit: Number(price_per_unit),
          total_amount,
          cash_transaction_id: cashTx.cash_transaction_id,
          occurred_at: occurred_at.toISOString(),
        },
      });
    }

    // ==== 卖出 ====
    if (transaction_type === 2) {
      // 检查是否有持仓、且持仓数充足
      const holding = await db.PortfolioHolding.findOne({
        where: { account_id, ticker },
        transaction: t,
      });
      if (!holding || Number(holding.quantity) < Number(quantity)) {
        await t.rollback();
        return res.status(StatusCodes.BAD_REQUEST).json({
          code: 400,
          msg: "Not enough holdings to sell.",
        });
      }

      // 收钱，生成 cash transaction(type=1)
      const new_balance = Number(acc.balance) + total_amount;
      const cashTx = await db.Cash.create(
        {
          account_id,
          type: 1, // money in
          amount: total_amount,
          related_id: null,
          description: `Sell ${quantity} ${ticker} @ ${price_per_unit}`,
          occurred_at,
          balance_after: new_balance,
        },
        { transaction: t },
      );

      // 更新账户余额
      await acc.update(
        { balance: new_balance, updated_at: new Date() },
        { transaction: t },
      );

      // 生成 portfolio transaction
      const portfolioTx = await db.PortfolioTransaction.create(
        {
          account_id,
          ticker,
          ticker_type,
          transaction_type,
          quantity,
          price_per_unit,
          total_amount,
          cash_transaction_id: cashTx.cash_transaction_id,
          occurred_at,
        },
        { transaction: t },
      );

      // 减少持仓，若持仓归零自动删除
      const remaining = Number(holding.quantity) - Number(quantity);
      if (remaining > 0) {
        await holding.update(
          {
            quantity: remaining,
            updated_at: new Date(),
          },
          { transaction: t },
        );
      } else {
        await holding.destroy({ transaction: t });
      }

      await t.commit();

      return res.status(StatusCodes.CREATED).json({
        code: 201,
        msg: "Portfolio sell transaction completed.",
        data: {
          portfolio_transaction_id: portfolioTx.portfolio_transaction_id,
          account_id,
          ticker,
          ticker_type,
          transaction_type,
          quantity: Number(quantity),
          price_per_unit: Number(price_per_unit),
          total_amount,
          cash_transaction_id: cashTx.cash_transaction_id,
          occurred_at: occurred_at.toISOString(),
        },
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ code: 500, msg: "Server error." });
  }
};

exports.getPortfolioHoldings = async (req, res) => {
  try {
    // 支持 GET 参数和 query/body 方式
    const account_id = Number(
      req.query.account_id || (req.body && req.body.account_id),
    );
    if (!account_id || isNaN(account_id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Valid account_id is required.",
      });
    }

    // 查询所有持仓
    const holdings = await db.PortfolioHolding.findAll({
      where: { account_id },
      order: [["created_at", "ASC"]],
    });

    if (!holdings || holdings.length === 0) {
      return res.status(StatusCodes.OK).json({
        code: 200,
        msg: "No holdings found.",
        data: [],
      });
    }

    // 针对每个 holding 查询对应的所有 transaction，构造返回值
    const results = await Promise.all(
      holdings.map(async (holding) => {
        // 查该持仓下的所有交易，最新的排在最前
        const transactions = await db.PortfolioTransaction.findAll({
          where: {
            account_id,
            ticker: holding.ticker,
          },
          order: [["occurred_at", "DESC"]],
        });

        // 取最新 price_per_unit，模拟现价
        let current_price = null;
        if (transactions.length > 0) {
          const latest_price = Number(transactions[0].price_per_unit);
          const delta = latest_price * (Math.random() * 0.4 - 0.2); // 现在是 -20% 到 +20%
          current_price = Number((latest_price + delta).toFixed(2));
        }

        // 计算加权买入成本
        let total_buy_amount = 0;
        let total_buy_quantity = 0;
        transactions.forEach((tx) => {
          if (tx.transaction_type === 1) {
            // 只统计买入
            total_buy_amount += Number(tx.price_per_unit) * Number(tx.quantity);
            total_buy_quantity += Number(tx.quantity);
          }
        });
        const avg_cost =
          total_buy_quantity > 0 ? total_buy_amount / total_buy_quantity : 0;

        // 盈亏
        const profit_loss = Number(
          ((current_price - avg_cost) * Number(holding.quantity)).toFixed(2),
        );

        return {
          portfolio_holding_id: holding.portfolio_holding_id,
          account_id: holding.account_id,
          ticker: holding.ticker,
          ticker_type: holding.ticker_type,
          quantity: Number(holding.quantity),
          created_at: holding.created_at,
          updated_at: holding.updated_at,
          current: {
            price_per_unit: current_price,
            profit_loss: profit_loss,
          },
          transactions: transactions.map((tx) => ({
            portfolio_transaction_id: tx.portfolio_transaction_id,
            account_id: tx.account_id,
            ticker: tx.ticker,
            ticker_type: tx.ticker_type,
            transaction_type: tx.transaction_type,
            quantity: Number(tx.quantity),
            price_per_unit: Number(tx.price_per_unit),
            total_amount: Number(tx.total_amount),
            cash_transaction_id: tx.cash_transaction_id,
            occurred_at: tx.occurred_at,
          })),
        };
      }),
    );

    return res.status(StatusCodes.OK).json({
      code: 200,
      msg: "Portfolio holdings retrieved successfully.",
      data: results,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ code: 500, msg: "Server error." });
  }
};
