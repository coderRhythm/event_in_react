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
        allowNull: false, 
      },
      email: {
        type: DataTypes.STRING,
        unique: true, 
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      role: {
        type: DataTypes.ENUM('student', 'faculty', 'eventManager', 'User'),
        allowNull: false,
        defaultValue: 'User', 
      },
    },
    {
      tableName: 'users',
      timestamps: true, 
      underscored: true, 
    }
  );
};

module.exports = createUserModel;
