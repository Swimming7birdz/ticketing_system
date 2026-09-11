const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BulkUploadChangeHistory = sequelize.define(
  "BulkUploadChangeHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    upload_batch_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.ENUM("student", "team", "team_member"),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    entity_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    change_type: {
      type: DataTypes.ENUM("created", "updated", "added", "removed", "moved"),
      allowNull: false,
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    old_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    changed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "bulk_upload",
    },
  },
  {
    tableName: "bulk_upload_change_history",
    timestamps: false,
    underscored: true,
  }
);

module.exports = BulkUploadChangeHistory;
