//mysql database connection
const config = require("../config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
    define: {
      timestamps: false,
    },
    storage: "./session.mysql",
  }
);

async function connect() {
  try {
    await sequelize.authenticate();
    console.log("mysql server connected");
  } catch (err) {
    //burası için index.js yüklemesi engellenebilir. Hata sayfası
    console.log("connect error" + err);
  }
}

connect();

module.exports = sequelize;
