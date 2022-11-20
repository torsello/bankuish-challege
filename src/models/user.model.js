module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    uuid: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    fullname: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  });

  return User;
};
