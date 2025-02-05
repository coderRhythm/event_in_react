const { DataTypes } = require('sequelize');

const createEventManagerModel = (sequelize) => {
  return sequelize.define(
    'EventManager',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      organizationName: {
        type: DataTypes.STRING,
        allowNull: false, // Organization Name is required
      },
      eventManagerId: {
        type: DataTypes.INTEGER, // This matches the field used in the 'events' model
        unique: true,
        allowNull: false, // Event Manager ID is required
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true, // Experience is optional
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users', // Name of the User table
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete EventManager if User is deleted
        onUpdate: 'CASCADE', // Update userId in EventManager if User ID changes
      },
    },
    {
      tableName: 'event_managers', // Explicitly define table name
      timestamps: true, // Enable createdAt and updatedAt
      underscored: true, // Use snake_case for column names
    }
  );
};

module.exports = createEventManagerModel;
