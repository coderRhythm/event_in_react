const { DataTypes } = require('sequelize');

// Define the Event Register Schema
const eventRegisterSchema = (sequelize) => {
  return sequelize.define('eventRegisterSchema', {  
    event_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    event_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    event_venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expected_participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_image: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    organizer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organizer_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sponsorship_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    event_website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    additional_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    organization_name: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    // Foreign Key for Event Manager
    event_manager_id: {
      type: DataTypes.INTEGER, // Ensure it is INTEGER to match 'eventManagerId' in eventManager model
      allowNull: false,
      references: {
        model: 'event_managers', // Ensure this matches the table name of eventManagers
        key: 'id', // Referring to the 'eventManagerId' column in eventManagers
      },
      onDelete: 'CASCADE', // This will delete associated records in eventRegister when eventManager is deleted
    },
    experience: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
  }, {
    tableName: 'events', // Explicitly define table name
    timestamps: true, 
    underscored: true, 
  });
};

module.exports = eventRegisterSchema;
