const { StatusCodes } = require("http-status-codes");
const db = require('../models');
//数据库主键还未考虑
// 创建投资组合持仓
const createPortfolioHolding = async (req, res) => {
    try {
        const {
            account_id,
            ticker,
            ticker_type,
            quantity
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

// 根据账户ID查询持仓
const getHoldingsByAccountId = async (req, res) => {
    try {
        const { account_id } = req.params;
        const { ticker_type } = req.query;

        const queryOptions = {
            where: { account_id }
        };

        // 如果指定了证券类型，添加到查询条件
        if (ticker_type !== undefined) {
            queryOptions.where.ticker_type = ticker_type;
        }

        const holdings = await db.PortfolioHolding.findAll(queryOptions);

        const responseData = holdings.map(holding => ({
            portfolio_holding_id: holding.portfolio_holding_id,
            account_id: holding.account_id,
            ticker: holding.ticker,
            ticker_type: holding.ticker_type,
            quantity: parseFloat(holding.quantity),
            updated_at: holding.updated_at
                ? new Date(holding.getDataValue('updated_at')).toISOString()
                : null
        }));

        return res.status(StatusCodes.OK).json({
            success: true,
            message: `查询账户${account_id}的投资组合持仓成功`,
            data: responseData
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: '查询投资组合持仓失败',
            error: error.message
        });
    }
};

module.exports = {
    createPortfolioHolding,
    getPortfolioHoldingById,
    updatePortfolioHolding,
    deletePortfolioHolding,
    getHoldingsByAccountId
};