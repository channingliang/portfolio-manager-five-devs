module.exports = (sequelize, DataTypes) => {
    const PortfolioHolding = sequelize.define('portfoli_holding', {
        portfolio_holding_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ticker: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        ticker_type: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        quantity: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            get() {
                const raw = this.getDataValue('created_at');
                if (!raw || isNaN(new Date(raw).getTime())) return null;
                return new Date(raw).toISOString().replace('T', ' ').substring(0, 19); // "YYYY-MM-DD HH:MM:SS"
            }
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
            get() {
                const value = this.getDataValue('updated_at');
                if (!value || isNaN(new Date(value).getTime())) return null;
                return new Date(value).toISOString().replace('T', ' ').substring(0, 19);
            }
        }
    }, {
        timestamps: false,
        tableName: 'portfolio_holding'
    });

    console.log('PortfolioHolding model initialized with fields:', PortfolioHolding.rawAttributes);

    return PortfolioHolding;
};