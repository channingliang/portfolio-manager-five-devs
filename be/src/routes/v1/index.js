const express = require("express");

const { InfoController, AccountController, CashController, TiingoController } = require("../../controllers");
const PortfolioHoldingController = require("../../controllers/portfolio-holding-controller");
const PortfolioTransactionController = require("../../controllers/portfolio-transaction-controller");

const router = express.Router();

// 基础信息接口
router.get("/info", InfoController.info);

// 创建账户接口
router.post("/account", AccountController.createAccount);

// 获取账户详情接口
router.get("/account/:id", AccountController.getAccountById);

//删除账户
router.delete("/account/:id", AccountController.deleteAccount);

// 现金交易接口
router.post("/cash/deposit", CashController.depositCash);
router.post("/cash/spend", CashController.spendCash);
router.get("/cash/account/:account_id", CashController.getCashTransactionsByAccount);


// 投资组合持仓接口
router.post("/portfolio/holding", PortfolioHoldingController.createPortfolioHolding);
router.delete("/portfolio/holding/:id", PortfolioHoldingController.deletePortfolioHolding);
// 更新投资组合持仓
router.patch("/portfolio/holding/:id", PortfolioHoldingController.updatePortfolioHolding);


// 投资组合交易接口
router.post("/portfolio/transaction", PortfolioTransactionController.createPortfolioTransaction);
router.delete("/portfolio/transaction/:id", PortfolioTransactionController.deletePortfolioTransaction);
// 更新投资组合交易
router.patch("/portfolio/transaction/:id", PortfolioTransactionController.updatePortfolioTransaction);

// 获取投资组合持仓详情
router.get("/portfolio/holding/:id", PortfolioHoldingController.getPortfolioHoldingById);

// 获取投资组合交易详情
router.get("/portfolio/transaction/:id", PortfolioTransactionController.getPortfolioTransactionById);

//tiingo数据接口
router.post("/tiingo", TiingoController.getTiingoData);
router.post("/tiingo/end_of_day", TiingoController.getEndOfDayData);
router.post("/tiingo/def", TiingoController.getDefinitionsData);
router.post("/tiingo/foud_overview", TiingoController.getFundOverview);
router.post("/tiingo/metaEndpoint", TiingoController.getMetaEndpoint);


module.exports = router;