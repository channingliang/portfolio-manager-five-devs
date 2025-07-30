const express = require("express");

const {
  InfoController,
  AccountController,
  CashController,
  MarketController,
} = require("../../controllers");
// const PortfolioHoldingController = require("../../controllers/de-portfolio-holding-controller");
// const PortfolioTransactionController = require("../../controllers/de-portfolio-transaction-controller");
const PortfolioHoldingController = require("../../controllers/portfolio-transaction-controller");
const PortfolioHoldingSummaryController = require("../../controllers/portfolio-holding-controller");

const router = express.Router();

// 基础信息接口
router.get("/info", InfoController.info);

// 创建账户接口
router.post("/account", AccountController.createAccount);

// 获取账户详情接口
router.get("/account/:id", AccountController.getAccountById);

// 更新账户信息接口PATCH /account/{id}
router.patch("/account/:id", AccountController.updateAccount);

//删除账户
router.delete("/account/:id", AccountController.deleteAccount);

// 现金交易接口
// 1. 创建现金交易（统一处理存款/支出，通过请求体type区分）
router.post("/cash", CashController.createCashTransaction);
// 2. 获取现金交易记录（通过query参数account_id筛选）
router.get("/cash", CashController.getCashTransactions);
// // 3. 获取现金分布（通过query参数account_id筛选）
// router.get("/cash/distribution", CashController.getCashDistribution);
router.get("/cash/summary", CashController.getCashSummary);

// // 投资组合持仓接口
// router.post(
//   "/portfolio/holding",
//   PortfolioHoldingController.createPortfolioHolding,
// );
// router.delete(
//   "/portfolio/holding/:id",
//   PortfolioHoldingController.deletePortfolioHolding,
// );
// // 更新投资组合持仓
// router.patch(
//   "/portfolio/holding/:id",
//   PortfolioHoldingController.updatePortfolioHolding,
// );
//
// // 投资组合交易接口
// router.post(
//   "/portfolio/transaction",
//   PortfolioTransactionController.createPortfolioTransaction,
// );
// router.delete(
//   "/portfolio/transaction/:id",
//   PortfolioTransactionController.deletePortfolioTransaction,
// );
// // 更新投资组合交易
// router.patch(
//   "/portfolio/transaction/:id",
//   PortfolioTransactionController.updatePortfolioTransaction,
// );
//
// // 获取投资组合持仓详情
// router.get(
//   "/portfolio/holding/:id",
//   PortfolioHoldingController.getPortfolioHoldingById,
// );
//
// // 获取投资组合交易详情
// router.get(
//   "/portfolio/transaction/:id",
//   PortfolioTransactionController.getPortfolioTransactionById,
// );
//
// 市场数据接口 - 新增内容
router.get("/market/stock", MarketController.getStockMarketData);

// 获取股票详情
router.get("/market/stock/:ticker", MarketController.getStockByTicker);
//
// //获取每周portfolio数据
// router.get(
//   "/portfolio/week/:id",
//   PortfolioHoldingsWeeklyController.getPortfolioHoldingsWeeklyChange,
// );

router.post(
  "/portfolio/transaction",
  PortfolioHoldingController.createPortfolioTransaction,
);

router.get(
  "/portfolio/holding",
  PortfolioHoldingController.getPortfolioHoldings,
);

router.get(
  "/portfolio/summary",
  PortfolioHoldingSummaryController.getPortfolioWeeklyChange,
);

module.exports = router;
