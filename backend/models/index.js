const createUserModel = require('./userSchema');
const createStudentModel = require('./studentSchema');
const createFacultyModel = require('./facultySchema');
const createEventManagerModel = require('./eventManagerSchema');
// const createEventModel = require('./eventSchema');
const eventRegisterSchema = require('./eventRegisterSchema');
// eventRegisterSchema
const initModels = (sequelize) => {
    const models = {
        User: createUserModel(sequelize),
        Student: createStudentModel(sequelize),
        Faculty: createFacultyModel(sequelize),
        EventManager: createEventManagerModel(sequelize),
      
        EventRegister: eventRegisterSchema(sequelize),   };

    models.User.hasOne(models.Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
    models.User.hasOne(models.Faculty, { foreignKey: 'userId', onDelete: 'CASCADE' });
    models.User.hasOne(models.EventManager, { foreignKey: 'userId', onDelete: 'CASCADE' });

    models.Student.belongsTo(models.User, { foreignKey: 'userId' });
    models.Faculty.belongsTo(models.User, { foreignKey: 'userId' });
    models.EventManager.belongsTo(models.User, { foreignKey: 'userId' });
        
    return models;
};

module.exports = initModels;
