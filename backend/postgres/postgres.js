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

        const models = initModels(sequelize);  

        await sequelize.sync({ alter: true }); 
        console.log('All models were synced successfully.');

        return models; 
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;  
    }
};

module.exports = { connection };
