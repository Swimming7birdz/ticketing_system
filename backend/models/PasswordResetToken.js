const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust path to your db.js

const PasswordResetToken = sequelize.define(
  "PasswordResetToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
    },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "password_reset_tokens", // match the migration
    timestamps: false, // because we are explicitly handling created_at/updated_at
    underscored: true, // keeps Sequelize aware of snake_case naming
  }
);

// optional: set up association (PasswordResetToken belongs to User)
PasswordResetToken.associate = (models) => {
  PasswordResetToken.belongsTo(models.User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
};

module.exports = PasswordResetToken;
