const { StatusCodes } = require("http-status-codes");
const db = require('../models');
// 创建投资组合持仓
const createPortfolioHolding = async (req, res) => {
    try {
        const {
            account_id,
            ticker,
            ticker_type,
            transaction_type,
            quantity,
            price_per_unit
        } = req.body;

        // 验证必要字段
        if (!account_id || !ticker || ticker_type === undefined || quantity === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: '缺少必要字段: account_id、ticker、ticker_type、quantity 是必需的',
                error: {}
            });
        }

        // 检查是否已存在相同的持仓记录
        const existingHolding = await db.PortfolioHolding.findOne({
            where: { account_id, ticker, ticker_type }
        });

        if (existingHolding) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: `该账户已存在 ${ticker} 的持仓记录`,
                error: {}
            });
        }

        // 创建持仓记录
        const newHolding = await db.PortfolioHolding.create({
            account_id,
            ticker,
            ticker_type,
            quantity,
            created_at: new Date(),
            updated_at: new Date()
        });

        const newTransaction = await db.PortfolioTransaction.create({
            account_id,
            ticker,
            ticker_type,
            transaction_type,
            quantity,
            price_per_unit,
            total_amount: quantity * price_per_unit,
            cash_transaction_id: newHolding.portfolio_holding_id,
            occurred_at: newHolding.created_at
        });

        const responseData = {
            portfolio_holding_id: newHolding.portfolio_holding_id,
            account_id: newHolding.account_id,
            ticker: newHolding.ticker,
            ticker_type: newHolding.ticker_type,
            quantity: parseFloat(newHolding.quantity),
            created_at: newHolding.created_at
        };

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: '投资组合持仓创建成功',
            data: responseData
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: '创建投资组合持仓失败',
            error: error.message
        });
    }
};

// 获取单个投资组合持仓
const getPortfolioHoldingById = async (req, res) => {
    try {
        const { id } = req.params;

        const holding = await db.PortfolioHolding.findByPk(id);

        if (!holding) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: `未找到 ID 为 ${id} 的投资组合持仓`
            });
        }

        const responseData = {
            portfolio_holding_id: holding.portfolio_holding_id,
            account_id: holding.account_id,
            ticker: holding.ticker,
            ticker_type: holding.ticker_type,
            quantity: parseFloat(holding.quantity),
            created_at: new Date(holding.getDataValue('created_at')).toISOString(),
            updated_at: holding.updated_at
                ? new Date(holding.getDataValue('updated_at')).toISOString()
                : null
        };

        return res.status(StatusCodes.OK).json({
            success: true,
            message: `获取${id}投资组合持仓`,
            data: responseData
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: '获取投资组合持仓失败',
            error: error.message
        });
    }
};

// 更新投资组合持仓
const updatePortfolioHolding = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: '缺少必要字段: quantity 是必需的',
                error: {}
            });
        }

        const holding = await db.PortfolioHolding.findByPk(id);

        if (!holding) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: `未找到 ID 为 ${id} 的投资组合持仓`
            });
        }

        // 更新持仓数量
        await holding.update({
            quantity,
            updated_at: new Date()
        });

        // 4. 关联查询 transaction 记录（按 account_id、ticker、ticker_type 关联，可根据实际调整）
        const { account_id, ticker, ticker_type } = holding; // 从 holding 中获取关联字段
        const relatedTransactions = await db.PortfolioTransaction.findAll({
            where: { account_id, ticker, ticker_type } // 关联条件：保证同账户、同标的、同类型
        });

        if (relatedTransactions.length === 0) {
            // 若没有关联的 transaction，可选择跳过或创建新记录（根据业务需求）
            console.log(`未找到 account_id=${account_id}、ticker=${ticker} 的关联 transaction`);
        } else {
            // 5. 遍历关联的 transaction，累加 quantity（原有值 + 传入的 inputQuantity）
            const updatePromises = relatedTransactions.map(transaction => {
                // 获取 transaction 中原有的 quantity（转换为数字避免字符串拼接）
                const originalQuantity = parseFloat(transaction.quantity) || 0;
                // 计算新值：原有值 + 传入的 quantity 参数值
                const newQuantity = originalQuantity + parseFloat(quantity);
                // 更新 transaction 的 quantity
                return transaction.update({
                    quantity: newQuantity,
                    updated_at: new Date() // 可选：更新交易的时间戳
                });
            });

            // 6. 等待所有更新操作完成（Promise.all 用于并行执行）
            await Promise.all(updatePromises);
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: `投资组合持仓${id}更新成功`,
            data: {
                portfolio_holding_id: holding.portfolio_holding_id,
                ticker: holding.ticker,
                quantity: parseFloat(quantity),
                updated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: '更新投资组合持仓失败',
            error: error.message
        });
    }
};

// 删除投资组合持仓
const deletePortfolioHolding = async (req, res) => {
    try {
        const { id } = req.params;

        const holding = await db.PortfolioHolding.findByPk(id);

        if (!holding) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: `未找到 ID 为 ${id} 的投资组合持仓`
            });
        }

        const transaction = await db.PortfolioTransaction.findByPk(id);

        if (!transaction) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: `未找到 ID 为 ${id} 的投资组合交易`
            });
        }

        await transaction.destroy();

        await holding.destroy();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: `删除 ID 为 ${id} 的投资组合持仓成功`
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: '删除投资组合持仓失败',
            error: error.message
        });
    }
};

module.exports = {
    createPortfolioHolding,
    getPortfolioHoldingById,
    updatePortfolioHolding,
    deletePortfolioHolding,
};