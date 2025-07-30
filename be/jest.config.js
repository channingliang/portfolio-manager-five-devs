module.exports = {
  preset: "ts-jest", // 如果使用 TypeScript
  testEnvironment: "node", // 使用 Node.js 环境
  testMatch: ["**/__tests__/**/*.test.js"], // 测试文件匹配规则
  moduleDirectories: ["node_modules", "be/src"], // 模块搜索路径
  coverageDirectory: "../coverage", // 覆盖率报告输出目录
  collectCoverageFrom: [
    "src/controllers/**/*.js", // 收集覆盖率的文件
    "!src/controllers/**/*.test.js", // 排除测试文件
  ],
};
