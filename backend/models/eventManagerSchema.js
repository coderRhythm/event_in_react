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
        allowNull: false, 
      },
      eventManagerId: {
        type: DataTypes.INTEGER, 
        unique: true,
        allowNull: false,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true, 
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
      tableName: 'event_managers', 
      timestamps: true,
      underscored: true,
    }
  );
};

module.exports = createEventManagerModel;
