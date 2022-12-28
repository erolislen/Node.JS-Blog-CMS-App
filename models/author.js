const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const bcrypt = require("bcrypt");

const Author = sequelize.define(
  "author",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Firstname required",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Lastname required",
        },
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        args: true,
        msg: "This e-mail address is registered in the system.",
      },
      validate: {
        notEmpty: {
          msg: "Email required",
        },
        isEmail: {
          msg: "Email address is invalid!",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required!",
        },
        len: {
          args: [5, 10],
          msg: "Password must be between 5 and 10 characters!",
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user.png",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Author.afterValidate(async (author) => {
  author.password = await bcrypt.hash(author.password, 10);
});

module.exports = Author;
