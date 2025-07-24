const express = require("express");

const { InfoController, AccountController } = require("../../controllers");

const router = express.Router();

// 基础信息接口
router.get("/info", InfoController.info);

// 创建账户接口
router.post("/account", AccountController.createAccount);

// 获取账户详情接口
router.get("/account/:id", AccountController.getAccountById);

//删除账户
router.delete("/account/:id", AccountController.deleteAccount); 

module.exports = router;
