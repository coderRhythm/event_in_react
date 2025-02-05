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
        allowNull: false, // PRN is required
      },
      course: {
        type: DataTypes.STRING,
        allowNull: false, // Course is required
      },
      branch: {
        type: DataTypes.STRING,
        allowNull: false, // Branch is required
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false, // Year is required
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', // Name of the User table
          key: 'id', // Primary key in the User table
        },
        onDelete: 'CASCADE', // Delete Student if associated User is deleted
        onUpdate: 'CASCADE', // Update userId in Student if User's id is updated
      },
    },
    {
      tableName: 'students', // Explicitly define table name for consistency
      timestamps: true, // Enable createdAt and updatedAt
      underscored: true, // Use snake_case in DB column names
    }
  );
};

module.exports = createStudentModel;
