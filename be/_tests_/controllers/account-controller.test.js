const request = require("supertest");
const express = require("express");
const httpStatus = require("http-status-codes");
const {
  createAccount,
  getAccountById,
  deleteAccount,
  updateAccount,
} = require("../../src/controllers/account-controller");

// 创建 Express 应用用于测试
const app = express();
app.use(express.json());

// 模拟数据库模型
jest.mock("../../src/models", () => {
  const SequelizeMock = require("sequelize-mock");
  const dbMock = new SequelizeMock();

  // 模拟 Account 模型
  const AccountMock = dbMock.define("Account", {
    user_id: 1,
    name: "Test Account",
    currency: "USD",
    balance: "0.00",
    created_at: new Date(),
    updated_at: new Date(),
  });

  // 模拟静态方法
  AccountMock.findByPk = jest.fn();
  AccountMock.create = jest.fn();

  // 模拟实例方法
  AccountMock.prototype.update = jest.fn();
  AccountMock.prototype.destroy = jest.fn();

  return {
    Account: AccountMock,
  };
});

const db = require("../../src/models");

// 测试前重置所有 mock
beforeEach(() => {
  jest.clearAllMocks();
});

// ==================== 测试 createAccount ====================
describe("POST /accounts", () => {
  // 设置路由
  beforeEach(() => {
    app.post("/accounts", createAccount);
  });

  // 测试成功创建账户
  it("should create a new account", async () => {
    // 模拟数据库创建操作
    const mockAccount = {
      user_id: 1,
      name: "Savings",
      currency: "USD",
      balance: "0.00",
      created_at: new Date(),
    };

    db.Account.create.mockResolvedValue(mockAccount);

    // 发送请求
    const response = await request(app)
      .post("/accounts")
      .send({ name: "Savings", currency: "USD" });

    // 验证响应
    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body.code).toBe(httpStatus.CREATED);
    expect(response.body.msg).toBe("Account create successfully.");
    expect(response.body.data.name).toBe("Savings");
    expect(response.body.data.currency).toBe("USD");

    // 验证数据库调用
    expect(db.Account.create).toHaveBeenCalledWith({
      name: "Savings",
      currency: "USD",
    });
  });

  // 测试缺少必要字段
  it("should return 400 if missing required fields", async () => {
    const response = await request(app)
      .post("/accounts")
      .send({ name: "Test" }); // 缺少 currency

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.body.code).toBe(httpStatus.BAD_REQUEST);
    expect(response.body.msg).toContain("缺少必要字段");
  });

  // 测试数据库错误
  it("should handle database errors", async () => {
    db.Account.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/accounts")
      .send({ name: "Test", currency: "USD" });

    expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.msg).toBe("创建账户失败");
  });
});

// ==================== 测试 getAccountById ====================
describe("GET /accounts/:id", () => {
  beforeEach(() => {
    app.get("/accounts/:id", getAccountById);
  });

  // 测试成功获取账户
  it("should get an account by ID", async () => {
    const mockAccount = {
      user_id: 1,
      name: "Savings",
      currency: "USD",
      balance: "100.50",
      created_at: new Date("2023-01-01"),
      updated_at: new Date("2023-01-02"),
      getDataValue: jest.fn((field) => this[field]),
    };

    db.Account.findByPk.mockResolvedValue(mockAccount);

    const response = await request(app).get("/accounts/1");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.code).toBe(httpStatus.OK);
    expect(response.body.data.name).toBe("Savings");
    expect(response.body.data.balance).toBe(100.5);

    // 验证日期格式
    expect(response.body.data.created_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  // 测试账户不存在
  it("should return 404 if account not found", async () => {
    db.Account.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/accounts/999");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body.code).toBe(httpStatus.NOT_FOUND);
    expect(response.body.msg).toContain("未找到 ID 为 999 的账户");
  });

  // 测试数据库错误
  it("should handle database errors", async () => {
    db.Account.findByPk.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/accounts/1");

    expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.msg).toBe("获取账户失败");
  });
});

// ==================== 测试 deleteAccount ====================
describe("DELETE /accounts/:id", () => {
  beforeEach(() => {
    app.delete("/accounts/:id", deleteAccount);
  });

  // 测试成功删除账户
  it("should delete an account", async () => {
    const mockAccount = {
      destroy: jest.fn(),
    };

    db.Account.findByPk.mockResolvedValue(mockAccount);

    const response = await request(app).delete("/accounts/1");

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.code).toBe(httpStatus.OK);
    expect(response.body.msg).toBe("Account deleted successfully.");

    // 验证数据库调用
    expect(mockAccount.destroy).toHaveBeenCalledTimes(1);
  });

  // 测试账户不存在
  it("should return 404 if account not found", async () => {
    db.Account.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/accounts/999");

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body.code).toBe(httpStatus.NOT_FOUND);
    expect(response.body.msg).toContain("未找到 ID 为 999 的账户");
  });

  // 测试数据库错误
  it("should handle database errors", async () => {
    const mockAccount = {
      destroy: jest.fn().mockRejectedValue(new Error("Delete failed")),
    };

    db.Account.findByPk.mockResolvedValue(mockAccount);

    const response = await request(app).delete("/accounts/1");

    expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.msg).toBe("删除账户失败");
  });
});

// ==================== 测试 updateAccount ====================
describe("PUT /accounts/:id", () => {
  beforeEach(() => {
    app.put("/accounts/:id", updateAccount);
  });

  // 测试成功更新账户
  it("should update an account", async () => {
    const mockAccount = {
      user_id: 1,
      name: "Old Name",
      currency: "USD",
      balance: "0.00",
      created_at: new Date("2023-01-01"),
      updated_at: new Date("2023-01-01"),
      update: jest.fn().mockResolvedValue({
        user_id: 1,
        name: "New Name",
        currency: "CNY",
        balance: "0.00",
        created_at: new Date("2023-01-01"),
        updated_at: new Date("2023-01-02"),
        getDataValue: jest.fn((field) => this[field]),
      }),
      getDataValue: jest.fn((field) => this[field]),
    };

    db.Account.findByPk.mockResolvedValue(mockAccount);

    const response = await request(app)
      .put("/accounts/1")
      .send({ name: "New Name", currency: "CNY" });

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.code).toBe(httpStatus.OK);
    expect(response.body.msg).toBe("Account updated successfully.");
    expect(response.body.data.name).toBe("New Name");
    expect(response.body.data.currency).toBe("CNY");

    // 验证数据库调用
    expect(mockAccount.update).toHaveBeenCalledWith({
      name: "New Name",
      currency: "CNY",
    });
  });

  // 测试账户不存在
  it("should return 404 if account not found", async () => {
    db.Account.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/accounts/999")
      .send({ name: "New Name" });

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body.code).toBe(httpStatus.NOT_FOUND);
    expect(response.body.msg).toContain("未找到 ID 为 999 的账户");
  });

  // 测试数据库错误
  it("should handle database errors", async () => {
    const mockAccount = {
      update: jest.fn().mockRejectedValue(new Error("Update failed")),
    };

    db.Account.findByPk.mockResolvedValue(mockAccount);

    const response = await request(app)
      .put("/accounts/1")
      .send({ name: "New Name" });

    expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.msg).toBe("更新账户失败");
  });
});
