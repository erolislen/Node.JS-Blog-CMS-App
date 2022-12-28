const Author = require("../models/author");
const bcrypt = require("bcrypt");
const slugField = require("../helpers/slugfield");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { nextTick } = require("process");

exports.getRegister = async function (req, res, next) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/register", {
      title: "Author Register",
      message: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.postRegister = async function (req, res, next) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const userName = slugField(firstName + lastName);
  const approved = req.body.approved == "on" ? 1 : 0;
  const ipAddress = req.socket.remoteAddress;

  // const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // const author = await Author.findOne({ where: { email: email } });

    // if (author) {
    //   req.session.message = {
    //     text: "This e-mail address is registered in the system.",
    //     type: "warning",
    //   };
    //   return res.redirect("register");
    // }
    await Author.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      userName: userName,
      approved: approved,
      url: userName,
      ipAddress: ipAddress,
    });

    emailService.sendMail({
      from: config.email.from,
      to: email,
      subject: "New Account",
      text: "New account successfully created!",
    });
    req.session.message = { text: "Registration Successful", type: "success" };
    return res.redirect("login");
  } catch (err) {
    let msg = "";

    if (
      err.name == "SequelizeValidationError" ||
      err.name == "SequelizeUniqueConstraintError"
    ) {
      for (let e of err.errors) {
        msg += e.message + " ";
      }

      return res.render("auth/register", {
        title: "Author Register",
        message: { text: msg, type: "danger" },
      });
    } else {
      next(err);
    }
  }
};

exports.getLogin = async function (req, res, next) {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "Author Login",
      message: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.getLogout = async function (req, res, next) {
  try {
    await req.session.destroy();
    return res.redirect("/account/login");
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const author = await Author.findOne({
      where: {
        email: email,
      },
    });

    if (!author) {
      return res.render("auth/login", {
        title: "Author Login",
        message: { text: "Login Failed", type: "danger" },
      });
    }

    const match = await bcrypt.compare(password, author.password);

    if (match) {
      const authorRoles = await author.getRoles({
        attributes: ["roleName"],
        raw: true,
      });

      req.session.roles = authorRoles.map((role) => role["roleName"]);
      req.session.isAuth = true;
      req.session.author = author;

      req.session.message = {
        text: "Welcome",
        type: "Success",
      };
      const url = req.query.returnUrl || "/admin/dashboard";
      return res.redirect(url);
    }

    return res.render("auth/login", {
      title: "Author Login",
      message: { text: "Login Failed", type: "danger" },
    });
  } catch (err) {
    next(err);
  }
};

exports.getReset = async function (req, res, next) {
  const message = req.session.message;
  delete req.session.message;

  try {
    return res.render("auth/reset-password", {
      title: "Author Reset Password",
      message: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.postReset = async function (req, res, next) {
  const email = req.body.email;

  try {
    var token = crypto.randomBytes(32).toString("hex");
    const author = await Author.findOne({ where: { email: email } });

    if (!author) {
      req.session.message = {
        text: "E-mail Address not found!",
        type: "danger",
      };
      return res.redirect("reset-password");
    }

    author.resetToken = token;
    author.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await author.save();

    emailService.sendMail({
      from: config.email.from,
      to: email,
      subject: "Reset Password",
      html: `
          <p>Click the link below to update your password</p>
          <p>
              <a href="http://127.0.0.1:3000/account/new-password/${token}">Reset Password</a>
          </p>
      `,
    });

    req.session.message = {
      text: "Check your e-mail address to reset your password",
      type: "success",
    };
    res.redirect("login");
  } catch (err) {
    next(err);
  }
};

exports.getNewPassword = async function (req, res, next) {
  const token = req.params.token;

  try {
    const author = await Author.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
    return res.render("auth/new-password", {
      title: "New Password",
      author: author,
    });
  } catch (err) {
    next(err);
  }
};

exports.postNewPassword = async function (req, res, next) {
  const token = req.body.token;
  const authorId = req.body.authorId;
  const newPassword = req.body.password;

  try {
    const author = await Author.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
      id: authorId,
    });

    author.password = await bcrypt.hash(newPassword, 10);
    author.resetToken = null;
    author.resetTokenExpiration = null;

    await author.save();

    req.session.message = {
      text: "Your password has been successfully updated",
      type: "success",
    };
    return res.redirect("login");
  } catch (error) {}
};
