const { DataTypes } = require('sequelize');

const createUserModel = (sequelize) => {
  return sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // Name is required
      },
      email: {
        type: DataTypes.STRING,
        unique: true, // Ensures unique emails
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Password is required
      },
      role: {
        type: DataTypes.ENUM('student', 'faculty', 'eventManager', 'User'),
        allowNull: false,
        defaultValue: 'User', // Default role
      },
    },
    {
      tableName: 'users',
      timestamps: true, // Enables createdAt and updatedAt timestamps
      underscored: true, // Uses snake_case column names in the database
    }
  );
};

module.exports = createUserModel;
