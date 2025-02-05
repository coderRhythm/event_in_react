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
        allowNull: false, // Faculty ID is required
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false, // Department is required
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false, // Designation is required
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', // Name of the User table
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete Faculty if User is deleted
        onUpdate: 'CASCADE', // Update faculty if User ID changes
      },
    },
    {
      tableName: 'faculties', // Explicitly define table name
      timestamps: true, // Enable createdAt and updatedAt
      underscored: true, // Use snake_case for column names
    }
  );
};

module.exports = createFacultyModel;
