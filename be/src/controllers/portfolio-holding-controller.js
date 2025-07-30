const fs = require("fs");
const path = require("path");
const { StatusCodes } = require("http-status-codes");
const db = require("../models");

function getDateArray(days) {
  // 取days天的日期数组(从14天前到今天)
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10)); // 只要日期部分
  }
  return arr;
}

// 读取单个ticker的历史收盘价
function loadEodData(ticker) {
  const file = path.join(__dirname, "../data", `end-of-day-${ticker}.json`);
  if (!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file);
  const arr = JSON.parse(raw);
  // 返回 {日期:收盘价}
  const obj = {};
  arr.forEach((e) => {
    obj[e.date.slice(0, 10)] = e.close;
  });
  return obj;
}

exports.getPortfolioWeeklyChange = async (req, res) => {
  try {
    // 1. 参数校验
    const account_id = Number(
      req.query.account_id || (req.body && req.body.account_id),
    );
    if (!account_id || isNaN(account_id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        msg: "Valid account_id is required.",
      });
    }

    // 2. 查所有持仓
    const holdings = await db.PortfolioHolding.findAll({
      where: { account_id },
    });
    if (!holdings || holdings.length === 0) {
      return res.status(StatusCodes.OK).json({
        code: 200,
        msg: "No holdings found.",
        data: [
          { name: "Cash", data: Array(14).fill(0) },
          { name: "Portfolio", data: Array(14).fill(0) },
          { name: "Profit", data: Array(14).fill(0) },
        ],
      });
    }
    const tickers = holdings.map((h) => h.ticker);

    // 3. 计算每日portfolio加权成本
    // 3.1 查所有portfolio_transaction
    const allTxs = await db.PortfolioTransaction.findAll({
      where: { account_id },
    });
    // 按ticker分组
    const txByTicker = {};
    for (const tx of allTxs) {
      if (!txByTicker[tx.ticker]) txByTicker[tx.ticker] = [];
      txByTicker[tx.ticker].push(tx);
    }

    // 4. 计算每日现金余额（根据现金流水来推算每日余额，初始用Account.balance）
    // 先查最新Account余额
    const account = await db.Account.findByPk(account_id);
    let todayBalance = account ? Number(account.balance) : 0;
    // 查全部 cash_transaction
    const cashTxs = await db.Cash.findAll({
      where: { account_id },
      order: [["occurred_at", "DESC"]],
    });

    // 5. 日期数组（14天）
    const dates = getDateArray(14);

    // 6. 计算每天
    const cashArr = [];
    const portfolioArr = [];
    const profitArr = [];

    // 【预加载所有ticker的历史行情】
    const priceMap = {};
    for (const t of tickers) {
      priceMap[t] = loadEodData(t);
    }

    // 【推算每天现金余额】
    // cashTxs按时间倒序；往前推每天的balance
    let dayBalances = {};
    let dayBalance = todayBalance;
    let cashTxIdx = 0;

    // dates倒序推算（最新日期在最后）
    for (let dIdx = dates.length - 1; dIdx >= 0; dIdx--) {
      const d = dates[dIdx];
      // 回到那天后，把那天之后发生的流水都加/减回来
      while (
        cashTxIdx < cashTxs.length &&
        cashTxs[cashTxIdx].occurred_at.toISOString().slice(0, 10) > d
      ) {
        const tx = cashTxs[cashTxIdx];
        if (tx.type === 1)
          dayBalance -= Number(tx.amount); // money-in,之前余额减去
        else if (tx.type === 2) dayBalance += Number(tx.amount); // money-out,之前余额加回来
        cashTxIdx++;
      }
      dayBalances[d] = dayBalance;
    }
    // cashArr是顺序
    for (let d of dates) {
      cashArr.push(Number(dayBalances[d].toFixed(2)));
    }

    // 【推算每天持仓及portfolio市值】
    // 逐天推
    let holdingSnapshots = {}; // {ticker:持仓数量}
    // 初始化，回溯所有交易获取每天的持仓
    // 每天快照
    for (let dIdx = 0; dIdx < dates.length; dIdx++) {
      const d = dates[dIdx];
      // 推算当天每只股票的持仓数量
      let snapshot = {};
      for (let t of tickers) snapshot[t] = 0;
      for (let t of tickers) {
        // 按每个ticker的所有交易，累计到当天为止的数量
        let qty = 0;
        for (let tx of txByTicker[t] || []) {
          if (tx.occurred_at.slice(0, 10) <= d) {
            if (tx.transaction_type === 1) qty += Number(tx.quantity);
            if (tx.transaction_type === 2) qty -= Number(tx.quantity);
          }
        }
        snapshot[t] = qty;
      }
      holdingSnapshots[d] = snapshot;
    }

    // 【逐天计算portfolio市值&加权成本&利润】
    for (let dIdx = 0; dIdx < dates.length; dIdx++) {
      const d = dates[dIdx];
      let portfolioValue = 0;
      let totalCost = 0;
      let totalQty = 0;

      for (let t of tickers) {
        const qty = holdingSnapshots[d][t];
        if (qty > 0) {
          // 当天收盘价
          const price = priceMap[t][d] || 0;
          portfolioValue += qty * price;

          // 按当天前所有买入累加加权成本
          let buyQty = 0,
            buyAmount = 0;
          for (let tx of txByTicker[t] || []) {
            if (tx.occurred_at.slice(0, 10) <= d && tx.transaction_type === 1) {
              buyQty += Number(tx.quantity);
              buyAmount += Number(tx.quantity) * Number(tx.price_per_unit);
            }
          }
          // 已卖出的数量
          let sellQty = 0;
          for (let tx of txByTicker[t] || []) {
            if (tx.occurred_at.slice(0, 10) <= d && tx.transaction_type === 2) {
              sellQty += Number(tx.quantity);
            }
          }
          // 当前实际持仓
          const holdingQty = qty;
          // 持有的加权成本
          const avgCost = buyQty > 0 ? buyAmount / buyQty : 0;
          totalCost += holdingQty * avgCost;
          totalQty += holdingQty;
        }
      }
      portfolioArr.push(Number(portfolioValue.toFixed(2)));
      profitArr.push(Number((portfolioValue - totalCost).toFixed(2)));
    }

    // 8. 返回
    return res.status(StatusCodes.OK).json({
      code: 200,
      msg: "Portfolio weekly change retrieved successfully.",
      data: [
        { name: "Cash", data: cashArr },
        { name: "Portfolio", data: portfolioArr },
        { name: "Profit", data: profitArr },
      ],
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      msg: "Server error.",
    });
  }
};
