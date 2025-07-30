module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "Account",
    {
      account_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        get() {
          const raw = this.getDataValue("created_at");
          if (!raw || isNaN(new Date(raw).getTime())) return null;
          return new Date(raw).toISOString().replace("T", " ").substring(0, 19); // "YYYY-MM-DD HH:MM:SS"
        },
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        get() {
          const value = this.getDataValue("updated_at");
          if (!value || isNaN(new Date(value).getTime())) return null;
          return new Date(value)
            .toISOString()
            .replace("T", " ")
            .substring(0, 19);
        },
      },
    },
    {
      timestamps: false, // 禁用 Sequelize 自动时间戳
      tableName: "account", // 对应数据库表名
    },
  );

  // console.log('Account model initialized with fields:', Account.rawAttributes);

  return Account;
};
