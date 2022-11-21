module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define("course", {
    uuid: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    priority: {
      type: Sequelize.TINYINT,
      allowNull: false,
      unique: true,
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return Course;
};
