const { StatusCodes } = require("http-status-codes");
const db = require('../models');
// 创建投资组合交易
const createPortfolioTransaction = async (req, res) => {
    try {
        const {
            account_id,
            ticker,
            ticker_type,
            transaction_type,
            quantity,
            price_per_unit,
            cash_transaction_id
        } = req.body;

        // 验证必要字段
        if (!account_id || !ticker || ticker_type === undefined || !transaction_type || !quantity || !price_per_unit) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                code: StatusCodes.BAD_REQUEST,
                msg: '缺少必要字段: account_id、ticker、ticker_type、transaction_type、quantity、price_per_unit 是必需的',
                error: {}
            });
        }

        // 计算总金额
        const total_amount = parseFloat(quantity) * parseFloat(price_per_unit);

        // 创建交易记录
        const newTransaction = await db.PortfolioTransaction.create({
            account_id,
            ticker,
            ticker_type,
            transaction_type,
            quantity,
            price_per_unit,
            total_amount,
            cash_transaction_id,
            occurred_at: new Date()
        });

        newHolding = await db.PortfolioHolding.create({
            account_id,
            ticker,
            ticker_type,
            quantity,
            created_at: new Date(),
            updated_at: new Date()
        });

        const responseData = {
            portfolio_transaction_id: newTransaction.portfolio_transaction_id,
            account_id: newTransaction.account_id,
            ticker: newTransaction.ticker,
            ticker_type: newTransaction.ticker_type,
            transaction_type: newTransaction.transaction_type,
            quantity: parseFloat(newTransaction.quantity),
            price_per_unit: parseFloat(newTransaction.price_per_unit),
            total_amount: parseFloat(newTransaction.total_amount),
            occurred_at: newTransaction.occurred_at
        };

        return res.status(StatusCodes.CREATED).json({
            code: StatusCodes.CREATED,
            msg: '投资组合交易创建成功',
            data: responseData
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: '创建投资组合交易失败',
            error: error.msg
        });
    }
};

// 获取单个投资组合交易
const getPortfolioTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await db.PortfolioTransaction.findByPk(id);

        if (!transaction) {
            return res.status(StatusCodes.NOT_FOUND).json({
                code: StatusCodes.NOT_FOUND,
                msg: `未找到 ID 为 ${id} 的投资组合交易`
            });
        }

        const responseData = {
            portfolio_transaction_id: transaction.portfolio_transaction_id,
            account_id: transaction.account_id,
            ticker: transaction.ticker,
            ticker_type: transaction.ticker_type,
            transaction_type: transaction.transaction_type,
            quantity: parseFloat(transaction.quantity),
            price_per_unit: parseFloat(transaction.price_per_unit),
            total_amount: parseFloat(transaction.total_amount),
            cash_transaction_id: transaction.cash_transaction_id,
            occurred_at: new Date(transaction.getDataValue('occurred_at')).toISOString()
        };

        return res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            msg: `查询 ID 为 ${id} 的投资组合交易成功`,
            data: responseData
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: '获取投资组合交易失败',
            error: error.msg
        });
    }
};

// 更新投资组合交易
const updatePortfolioTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            price_per_unit,
            quantity,
            cash_transaction_id
        } = req.body;

        const transaction = await db.PortfolioTransaction.findByPk(id);

        if (!transaction) {
            return res.status(StatusCodes.NOT_FOUND).json({
                code: StatusCodes.NOT_FOUND,
                msg: `未找到 ID 为 ${id} 的投资组合交易`
            });
        }

        // 计算新的总金额（如果价格或数量有更新）
        let total_amount = transaction.total_amount;
        if (price_per_unit !== undefined && quantity !== undefined) {
            total_amount = parseFloat(price_per_unit) * parseFloat(quantity);
        } else if (price_per_unit !== undefined) {
            total_amount = parseFloat(price_per_unit) * parseFloat(transaction.quantity);
        } else if (quantity !== undefined) {
            total_amount = parseFloat(transaction.price_per_unit) * parseFloat(quantity);
        }

        // 更新交易记录
        const updatedTransaction = await transaction.update({
            ...(price_per_unit !== undefined && { price_per_unit }),
            ...(quantity !== undefined && { quantity }),
            ...(cash_transaction_id !== undefined && { cash_transaction_id }),
            ...(total_amount !== transaction.total_amount && { total_amount })
        });


        const { account_id } = updatedTransaction; // 仅使用account_id作为关联条件

        // 查找该account_id对应的所有持仓记录
        const relatedHoldings = await db.PortfolioHolding.findAll({
            where: { account_id } // 仅通过account_id关联
        });

        if (relatedHoldings.length > 0 && quantity !== undefined) {
            // 遍历更新所有关联持仓的quantity（可根据业务调整更新规则）
            // 示例规则：将该账户下所有持仓的quantity更新为交易的最新quantity
            const updatePromises = relatedHoldings.map(holding =>
                holding.update({
                    quantity,
                    updated_at: new Date()
                })
            );
            await Promise.all(updatePromises);
        } else if (relatedHoldings.length === 0) {
            console.log(`未找到 account_id 为 ${account_id} 的关联持仓记录`);
        }

        return res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            msg: `投资组合交易 ${id} 更新成功`,
            data: {
                portfolio_transaction_id: transaction.portfolio_transaction_id,
                total_amount: parseFloat(total_amount)
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: `更新投资组合交易 ${id} 失败`,
            error: error.msg
        });
    }
};

// 删除投资组合交易
const deletePortfolioTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await db.PortfolioTransaction.findByPk(id);

        if (!transaction) {
            return res.status(StatusCodes.NOT_FOUND).json({
                code: StatusCodes.NOT_FOUND,
                msg: `未找到 ID 为 ${id} 的投资组合交易`
            });
        }

        const holding = await db.PortfolioHolding.findByPk(id);

        if (!holding) {
            return res.status(StatusCodes.NOT_FOUND).json({
                code: StatusCodes.NOT_FOUND,
                msg: `未找到 ID 为 ${id} 的投资组合持仓`
            });
        }

        await transaction.destroy();
        await holding.destroy();


        return res.status(StatusCodes.OK).json({
            code: StatusCodes.OK,
            msg: `投资组合交易 ${id} 删除成功`
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: '删除投资组合交易失败',
            error: error.msg
        });
    }
};

module.exports = {
    createPortfolioTransaction,
    getPortfolioTransactionById,
    updatePortfolioTransaction,
    deletePortfolioTransaction
};