const { DataTypes } = require('sequelize');

const createEventModel = (sequelize) => {
    return sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        eventName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};

module.exports = createEventModel;
