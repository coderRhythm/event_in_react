const { DataTypes } = require('sequelize');

const createFacultyModel = (sequelize) => {
  return sequelize.define(
    'Faculty',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      facultyId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      designation: {
        type: DataTypes.STRING,
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
      tableName: 'faculties', 
      timestamps: true, 
      underscored: true, 
    }
  );
};

module.exports = createFacultyModel;
