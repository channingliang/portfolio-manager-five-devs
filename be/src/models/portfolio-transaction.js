module.exports = (sequelize, DataTypes) => {
    const PortfolioTransaction = sequelize.define('portfolio_transaction', {
        portfolio_transaction_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ticker: {
            type: DataTypes.STRING(16),
            allowNull: true
        },
        ticker_type: {
            type: DataTypes.TINYINT,
            allowNull: true
        },
        transaction_type: {
            type: DataTypes.TINYINT,
            allowNull: true
        },
        quantity: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: true
        },
        price_per_unit: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: true
        },
        total_amount: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: true
        },
        cash_transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        occurred_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
            get() {
                const raw = this.getDataValue('occurred_at');
                if (!raw || isNaN(new Date(raw).getTime())) return null;
                return new Date(raw).toISOString().replace('T', ' ').substring(0, 19); // "YYYY-MM-DD HH:MM:SS"
            }
        }
    }, {
        timestamps: false,
        tableName: 'portfolio_transaction'
    });

    console.log('PortfolioTransaction model initialized with fields:', PortfolioTransaction.rawAttributes);

    return PortfolioTransaction;
};