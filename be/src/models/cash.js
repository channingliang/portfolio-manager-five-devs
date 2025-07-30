module.exports = (sequelize, DataTypes) => {
  const Cash = sequelize.define(
    "cash_transaction",
    {
      cash_transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      related_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      occurred_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      balance_after: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        defaultValue: null,
        get() {
          const value = this.getDataValue("balance_after");
          if (value === null || isNaN(parseFloat(value))) return null;
          return parseFloat(value).toFixed(2);
        },
      },
    },
    {
      tableName: "cash_transaction",
      timestamps: false,
    },
  );

  return Cash;
};
