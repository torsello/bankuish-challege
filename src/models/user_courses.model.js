module.exports = (sequelize, Sequelize) => {
  const user_courses = sequelize.define(
    "user_courses",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      lifecycle: Sequelize.STRING,
    },
    { timestamps: false }
  );

  return user_courses;
};
