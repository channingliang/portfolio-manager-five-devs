// const { StatusCodes } = require("http-status-codes");
// const db = require('../models'); // 引入Sequelize模型
// const { Op } = require('sequelize'); // 引入查询操作符
// const moment = require('moment'); // 日期处理工具（需安装：npm i moment）

// // 获取投资组合每周变化（现金余额 + 投资金额）
// const getPortfolioHoldingsWeeklyChange = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const account_id = id;

//         if (!account_id) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 code: StatusCodes.BAD_REQUEST,
//                 msg: "Missing required parameter: account_id"
//             });
//         }

//         // 2. 查询账户信息（获取当前现金余额）
//         const account = await db.Account.findByPk(account_id);
//         if (!account) {
//             return res.status(StatusCodes.NOT_FOUND).json({
//                 code: StatusCodes.NOT_FOUND,
//                 msg: `Account with ID ${account_id} not found`
//             });
//         }
//         const currentCashBalance = account.balance;

//         // 3. 定义时间范围：过去7天（含当天）
//         const sevenDaysAgo = moment().subtract(6, 'days').startOf('day'); // 一周前 00:00:00
//         const todayEnd = moment().endOf('day'); // 当天 23:59:59

//         // ========================
//         // 4. 计算每日现金余额（Cash）
//         // ========================
//         // 查询过去7天的现金交易，按天分组求和


//         const cashTransactions = await db.Cash.findAll({
//             where: {
//                 account_id,
//                 occurred_at: {
//                     [Op.between]: [sevenDaysAgo.toDate(), todayEnd.toDate()]
//                 }
//             },
//             attributes: [
//                 [db.sequelize.fn('DATE', db.sequelize.col('occurred_at')), 'date'], // 按日期分组
//                 [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'daily_amount'] // 每日交易净额
//             ],
//             group: ['date'], // 按日期分组
//             order: ['date'] // 按日期升序排列
//         });


//         // 转换为 { 日期: 交易净额 } 的映射
//         const cashDailyMap = {};
//         cashTransactions.forEach(item => {
//             const dateStr = moment(item.date).format('YYYY-MM-DD');
//             cashDailyMap[dateStr] = parseFloat(item.daily_amount);
//         });

//         // 计算初始余额（一周前的现金余额 = 当前余额 - 过去7天总交易净额）
//         const totalCashChange = cashTransactions.reduce(
//             (sum, item) => sum + parseFloat(item.daily_amount),
//             0
//         );
//         const initialCash = currentCashBalance - totalCashChange;

//         // 生成过去7天的日期列表（按时间顺序：一周前 → 今天）
//         const days = [];
//         for (let i = 6; i >= 0; i--) {
//             const day = moment().subtract(i, 'days').format('YYYY-MM-DD');
//             days.push(day);
//         }

//         // 逐日计算现金余额（初始余额 + 每日交易净额）
//         const cashData = [];
//         let currentCash = initialCash;
//         days.forEach(day => {
//             const dailyChange = cashDailyMap[day] || 0; // 当天无交易则为0
//             currentCash += dailyChange;
//             cashData.push(currentCash);
//         });

//         // return res.status(StatusCodes.OK).json({
//         //     code: StatusCodes.OK,
//         //     msg: "Success to retrieve portfolio weekly change.",
//         //     data: cashData
//         // });

//         // ============================
//         // 5. 计算每日投资金额（Portfolio）
//         // ============================
//         // 查询过去7天的投资交易，按天分组求和 total_amount
//         const portfolioTransactions = await db.PortfolioTransaction.findAll({
//             where: {
//                 account_id,
//                 occurred_at: {
//                     [Op.between]: [sevenDaysAgo.toDate(), todayEnd.toDate()]
//                 }
//             },
//             attributes: [
//                 [db.sequelize.fn('DATE', db.sequelize.col('occurred_at')), 'date'], // 按日期分组
//                 [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'daily_investment'] // 每日投资总额
//             ],
//             group: ['date'], // 按日期分组
//             order: ['date'] // 按日期升序排列
//         });

//         // 转换为 { 日期: 投资总额 } 的映射
//         const portfolioDailyMap = {};
//         portfolioTransactions.forEach(item => {
//             const dateStr = moment(item.date).format('YYYY-MM-DD');
//             portfolioDailyMap[dateStr] = parseFloat(item.daily_investment);
//         });

//         // 逐日提取投资金额（无交易则为0）
//         const portfolioData = [];
//         days.forEach(day => {
//             const dailyInvestment = portfolioDailyMap[day] || 0;
//             portfolioData.push(dailyInvestment);
//         });

//         // ========================
//         // 6. 组装响应数据
//         // ========================
//         return res.status(StatusCodes.OK).json({
//             code: StatusCodes.OK,
//             msg: "Portfolio weekly change retrieved successfully.",
//             data: [
//                 {
//                     name: "Cash",
//                     data: cashData // 过去7天的每日现金余额
//                 },
//                 {
//                     name: "Portfolio",
//                     data: portfolioData // 过去7天的每日投资金额
//                 }
//             ]
//         });

//     } catch (error) {
//         console.error("Error in getPortfolioHoldingsWeeklyChange:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             code: StatusCodes.INTERNAL_SERVER_ERROR,
//             msg: "Failed to retrieve portfolio weekly change.",
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     getPortfolioHoldingsWeeklyChange
// };




// 2

const { StatusCodes } = require("http-status-codes");
const db = require('../models'); // 引入Sequelize模型
const { Op } = require('sequelize'); // 引入查询操作符
const moment = require('moment'); // 日期处理工具（需安装：npm i moment）

// 获取投资组合每周变化（现金余额 + 投资金额）
const getPortfolioHoldingsWeeklyChange = async (req, res) => {
    try {
        const { id } = req.params;
        const account_id = id;

        if (!account_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                msg: "Missing required parameter: account_id"
            });
        }

        // 2. 查询账户信息（获取当前现金余额）
        const account = await db.Account.findByPk(account_id);
        if (!account) {
            return res.status(StatusCodes.NOT_FOUND).json({
                code: StatusCodes.NOT_FOUND,
                msg: `Account with ID ${account_id} not found`
            });
        }
        // 验证当前现金余额是否为 null 或 undefined
        const currentCashBalance = account.balance;
        if (currentCashBalance === null || currentCashBalance === undefined) {
            console.error(`Current cash balance is null or undefined for account ID: ${account_id}`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                code: StatusCodes.INTERNAL_SERVER_ERROR,
                msg: "Current cash balance is invalid",
                error: {}
            });
        }

        // 3. 定义时间范围：过去7天（含当天）
        const sevenDaysAgo = moment().subtract(6, 'days').startOf('day'); // 一周前 00:00:00
        const todayEnd = moment().endOf('day'); // 当天 23:59:59

        // ========================
        // 4. 计算每日现金余额（Cash）
        // ========================
        // 查询过去7天的现金交易，按天分组求和
        const cashTransactions = await db.Cash.findAll({
            where: {
                account_id,
                occurred_at: {
                    [Op.between]: [sevenDaysAgo.toDate(), todayEnd.toDate()]
                }
            },
            attributes: [
                [db.sequelize.fn('DATE', db.sequelize.col('occurred_at')), 'date'], // 按日期分组
                [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'daily_amount'] // 每日交易净额
            ],
            group: ['date'], // 按日期分组
            order: ['date'] // 按日期升序排列
        });

        console.log('Cash transactions:', cashTransactions);

        // 转换为 { 日期: 交易净额 } 的映射
        const cashDailyMap = {};
        cashTransactions.forEach(item => {
            const dateStr = moment(item.get('date')).format('YYYY-MM-DD');
            const dailyAmount = parseFloat(item.get('daily_amount'));
            if (!isNaN(dailyAmount)) {
                cashDailyMap[dateStr] = dailyAmount;
            }
        });

        // 计算初始余额（一周前的现金余额 = 当前余额 - 过去7天总交易净额）
        const totalCashChange = cashTransactions.reduce(
            (sum, item) => {
                const dailyAmount = parseFloat(item.get('daily_amount'));
                return sum + (isNaN(dailyAmount) ? 0 : dailyAmount);
            },
            0
        );
        const initialCash = currentCashBalance - totalCashChange;

        // 生成过去7天的日期列表（按时间顺序：一周前 → 今天）
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const day = moment().subtract(i, 'days').format('YYYY-MM-DD');
            days.push(day);
        }

        // 逐日计算现金余额（初始余额 + 每日交易净额）
        const cashData = [];
        let currentCash = initialCash;
        days.forEach(day => {
            const dailyChange = cashDailyMap[day] || 0; // 当天无交易则为0
            currentCash += dailyChange;
            cashData.push(currentCash);
        });

        // ============================
        // 5. 计算每日投资金额（Portfolio）
        // ============================
        // 查询过去7天的投资交易，按天分组求和 total_amount
        const portfolioTransactions = await db.PortfolioTransaction.findAll({
            where: {
                account_id,
                occurred_at: {
                    [Op.between]: [sevenDaysAgo.toDate(), todayEnd.toDate()]
                }
            },
            attributes: [
                [db.sequelize.fn('DATE', db.sequelize.col('occurred_at')), 'date'], // 按日期分组
                [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'daily_investment'] // 每日投资总额
            ],
            group: ['date'], // 按日期分组
            order: ['date'] // 按日期升序排列
        });

        console.log('Portfolio transactions:', portfolioTransactions);

        // 转换为 { 日期: 投资总额 } 的映射
        const portfolioDailyMap = {};
        portfolioTransactions.forEach(item => {
            const dateStr = moment(item.get('date')).format('YYYY-MM-DD');
            const dailyInvestment = parseFloat(item.get('daily_investment'));
            if (!isNaN(dailyInvestment)) {
                portfolioDailyMap[dateStr] = dailyInvestment;
            }
        });

        // 逐日提取投资金额（无交易则为0）
        const portfolioData = [];
        days.forEach(day => {
            const dailyInvestment = portfolioDailyMap[day] || 0;
            portfolioData.push(dailyInvestment);
        });

        // ========================
        // 6. 组装响应数据
        // ========================
        return res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            msg: "Portfolio weekly change retrieved successfully.",
            data: [
                {
                    name: "Cash",
                    data: cashData // 过去7天的每日现金余额
                },
                {
                    name: "Portfolio",
                    data: portfolioData // 过去7天的每日投资金额
                }
            ]
        });

    } catch (error) {
        console.error("Error in getPortfolioHoldingsWeeklyChange:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: "Failed to retrieve portfolio weekly change.",
            error: error.message
        });
    }
};

module.exports = {
    getPortfolioHoldingsWeeklyChange
};
