const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  username: process.env.DB_USERNAME || "root", // 替换为实际用户名
  password: process.env.DB_PASSWORD || "liang",
  database: process.env.DB_NAME || "hsbc",
  host: process.env.DB_HOST || "localhost",
  dialect: "mysql", // 明确指定数据库类型
  logging: false, // 可选：关闭 SQL 查询日志
};
