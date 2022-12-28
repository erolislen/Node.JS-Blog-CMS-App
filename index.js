//config
const config = require('config');

// express
const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

//node modules
const path = require("path");

// routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

//custom module
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");
const logger = require("./middlewares/logger");
const log = require("./middlewares/log");
const error = require("./middlewares/error-handling");

//template engine
app.set("view engine", "ejs");

//models
const Category = require("./models/category");
const Blog = require("./models/blog");
const Author = require("./models/author");
const Message = require("./models/message");
const Role = require("./models/role");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "hello world",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

app.use(locals);

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);

app.use("*", (req, res) => {
  res.status(404).render("error/404", { title: "404 Not Found!" });
});

app.use(log);
app.use(error);

Blog.belongsToMany(Category, { through: "blogCategories" });
Category.belongsToMany(Blog, { through: "blogCategories" });

Role.belongsToMany(Author, { through: "authorRoles" });
Author.belongsToMany(Role, { through: "authorRoles" });

Author.hasMany(Blog);
Blog.belongsTo(Author);

//IIFE
(async () => {
  // await sequelize.sync({ force: true });
  // await dummyData();
})();



const port = process.env.PORT || 3000;

app.listen(port, function () {
  logger.info(`listening on port ${port}`);
});
