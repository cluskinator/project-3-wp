module.exports = function(sequelize, Sequelize) {
 
    var Form = sequelize.define('response', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
 
        vocabulary: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        grammar: {
            type: Sequelize.STRING,
            notEmpty: true
        },
 
        accent: {
            type: Sequelize.STRING,
            notEmpty: true
        },
    });

    return Form; 
}