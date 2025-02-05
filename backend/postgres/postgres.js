const { Sequelize } = require('sequelize');
const initModels = require('../models');

const sequelize = new Sequelize('eventdb', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const models = initModels(sequelize);  // Initialize models here

        await sequelize.sync({ alter: true }); // Use alter if needed to update table schemas without dropping
        console.log('All models were synced successfully.');

        return models;  // Return the initialized models
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;  // Throw error if connection fails
    }
};

module.exports = { connection };
