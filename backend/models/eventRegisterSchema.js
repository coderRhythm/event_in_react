const { DataTypes } = require('sequelize');

const eventRegisterSchema = (sequelize) => {
  return sequelize.define('eventRegisterSchema', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },  
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
      type: DataTypes.STRING  ,
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
    target_audience: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:'Student',
      validate: {
        isIn: {
          args: [['Student', 'Faculty', 'both']], 
          msg: 'Target Audience must be one of: Student, Faculty, or both', 
        },
      },
    },
    
    event_manager_id: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      references: {
        model: 'event_managers', 
        key: 'id', 
      },
      onDelete: 'CASCADE', 
    },
    experience: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'assigned']],
          msg: 'Status must be either "pending" or "assigned"',
        },
      },
    },

    // New Field: Event type (free or paid)
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:'free',
      validate: {
        isIn: {
          args: [['free', 'paid']],
          msg: 'Event type must be either "free" or "paid"',
        },
      },
    },

  }, {
    tableName: 'events',
    timestamps: true, 
    underscored: true, 
  });
};

module.exports = eventRegisterSchema;
