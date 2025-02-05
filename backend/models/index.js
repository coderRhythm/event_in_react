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
        // Event: createEventModel(sequelize),
        EventRegister: eventRegisterSchema(sequelize),   };

    // Associations
    // User has one of each specific role: Student, Faculty, or EventManager
    models.User.hasOne(models.Student, { foreignKey: 'userId', onDelete: 'CASCADE' });
    models.User.hasOne(models.Faculty, { foreignKey: 'userId', onDelete: 'CASCADE' });
    models.User.hasOne(models.EventManager, { foreignKey: 'userId', onDelete: 'CASCADE' });

    // Each role belongs to one User
    models.Student.belongsTo(models.User, { foreignKey: 'userId' });
    models.Faculty.belongsTo(models.User, { foreignKey: 'userId' });
    models.EventManager.belongsTo(models.User, { foreignKey: 'userId' });
        // models.EventRegister.belongsTo(models.belongsTo)
    return models;
};

module.exports = initModels;
