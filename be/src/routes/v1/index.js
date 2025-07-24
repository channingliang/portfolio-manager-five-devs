const express = require("express");

const { InfoController, AccountController } = require("../../controllers");

const router = express.Router();

router.get("/info", InfoController.info);
router.post("/account", AccountController.createAccount);

module.exports = router;
