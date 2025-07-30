const express = require("express");

const { InfoController, AccountController } = require("../../controllers");
const CashController = require("../../controllers/cashController");
const TiingoController = require("../../controllers/tiingoController");

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

//tiingo数据接口
router.post("/tiingo", TiingoController.getTiingoData);
router.post("/tiingo/end_of_day", TiingoController.getEndOfDayData);
router.post("/tiingo/def", TiingoController.getDefinitionsData);
router.post("/tiingo/foud_overview", TiingoController.getFundOverview);
router.post("/tiingo/metaEndpoint", TiingoController.getMetaEndpoint);


module.exports = router;
