const { DataTypes } = require('sequelize');

const createStudentModel = (sequelize) => {
  return sequelize.define(
    'Student',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      prn: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, 
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', 
          key: 'id', 
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
      },
    },
    {
      tableName: 'students', 
      timestamps: true, 
      underscored: true, 
    }
  );
};

module.exports = createStudentModel;
