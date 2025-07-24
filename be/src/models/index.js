'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// 核心修正：config 与 models 同级（都在 src 下），因此路径为 '../config'
const { ServerConfig } = require('../config');

const db = {};

let sequelize;
// 使用 ServerConfig 中的数据库配置初始化 Sequelize
sequelize = new Sequelize(
  ServerConfig.database,    // 数据库名（hsbc）
  ServerConfig.username,    // 用户名（如 root）
  ServerConfig.password,    // 密码（如 123456）
  {
    host: ServerConfig.host,      // 主机（localhost）
    dialect: ServerConfig.dialect, // 数据库类型（mysql）
    logging: ServerConfig.logging  // 是否打印 SQL 日志（false）
  }
);

// 自动加载当前目录（models）下的所有模型文件
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&          // 排除隐藏文件（如 .gitignore）
      file !== basename &&                // 排除自身（index.js）
      file.slice(-3) === '.js' &&         // 只加载 .js 文件
      file.indexOf('.test.js') === -1     // 排除测试文件
    );
  })
  .forEach(file => {
    // 引入模型文件并初始化
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // 将模型添加到 db 对象
  });

// 执行模型关联（如果模型定义了 associate 方法）
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 导出 Sequelize 实例和所有模型
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;