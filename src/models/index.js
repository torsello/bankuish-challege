const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user_courses = require("./user_courses.model.js")(sequelize, Sequelize);
db.course = require("./course.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);


db.user_courses.belongsTo(db.course, {
  foreignKey: "courseId"
})

db.user_courses.belongsTo(db.user, {
  foreignKey: "userId"
})

db.course.belongsTo(db.course, {
  foreignKey: "requiredCourseId",
});

db.user.belongsToMany(db.course, { through: "user_courses" });
db.course.belongsToMany(db.user, { through: "user_courses" });

module.exports = {db, sequelize};
