//Model defination
const Blog = require("../models/blog");
const Category = require("../models/category");
const Author = require("../models/author");
const Message = require("../models/message");
const Role = require("../models/role");
const { Op } = require("sequelize");
const fs = require("fs");
const slugField = require("../helpers/slugfield");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const sequelize = require("../data/db");

exports.getDashboard = async function (req, res) {
  const blogCount = await Blog.count();
  const categoryCount = await Category.count();
  const authorCount = await Author.count();
  const messageCount = await Message.count();

  const message = req.session.message;
  delete req.session.message;

  res.render("admin/dashboard", {
    title: "Dashboard",
    blogCount: blogCount,
    categoryCount: categoryCount,
    authorCount: authorCount,
    messageCount: messageCount,
    message: message,
  });
};

exports.postBlogStatusUpdate = async function (req, res) {
  const blogId = req.params.blogId;
  let approved = req.query.approved;

  approved = approved == 1 ? 0 : 1;

  try {
    await Blog.update(
      { approved: approved },
      {
        where: {
          id: blogId,
        },
      }
    );
    res.redirect("/admin/blogs?action=update");
  } catch (err) {
    console.log(err);
  }
};

exports.getBlogDelete = async function (req, res) {
  const blogId = req.params.blogId;
  const authorId = req.session.author.id;

  const isAdmin = req.session.roles.includes("admin");

  try {
    const blog = await Blog.findOne({
      where: isAdmin ? { id: blogId } : { id: blogId, authorId: authorId },
    });

    res.render("admin/blog-delete", {
      title: "Delete Blog",
      blog: blog,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postBlogDelete = async function (req, res) {
  const blogId = req.body.blogId;
  try {
    await Blog.destroy({
      where: {
        id: blogId,
      },
    });
    res.redirect("/admin/blogs?action=delete");
  } catch (err) {
    console.log(err);
  }
};

exports.getCategoryDelete = async function (req, res) {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findByPk(categoryId);

    res.render("admin/category-delete", {
      title: "Delete Category",
      category: category,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCategoryDelete = async function (req, res) {
  const categoryId = req.body.categoryId;
  try {
    await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    res.redirect("/admin/categories?action=delete");
  } catch (err) {
    console.log(err);
  }
};

exports.getBlogCreate = async function (req, res) {
  try {
    const categories = await Category.findAll();
    res.render("admin/blog-create", {
      title: "Add Blog",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postBlogCreate = async function (req, res) {
  const title = req.body.title;
  const url = slugField(req.body.title);
  const description = req.body.description;
  const shortDescription = req.body.shortDescription;
  // const image = req.file.filename;
  const category = req.body.category;
  const homePage = req.body.homePage == "on" ? 1 : 0;
  const approved = req.body.approved == "on" ? 1 : 0;
  const categoryId = req.body.category;
  const authorId = req.session.author.id;
  let image = "";

  try {
    //file.size ile dosya boyut kontrolü yapılabilir...

    if (req.file) {
      image = req.file.filename;

      fs.unlink("./public/images/" + req.body.image, (err) => {
        console.log(err);
      });
    }
    await Blog.create({
      title: title,
      url: url,
      description: description,
      shortDescription: shortDescription,
      image: image,
      category: category,
      homePage: homePage,
      approved: approved,
      categoryId: categoryId,
      authorId: authorId,
    });

    res.redirect("/admin/blogs?action=create");
  } catch (err) {
    console.log(err);
  }
};

exports.getCategoryCreate = async function (req, res) {
  try {
    res.render("admin/category-create", {
      title: "Add Category",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postCategoryCreate = async function (req, res) {
  const name = req.body.name;
  const icon = req.body.icon;
  const url = slugField(req.body.name);

  try {
    await Category.create({ name: name, url: url, icon: icon });
    res.redirect("/admin/categories?action=create");
  } catch (err) {
    console.log(err);
  }
};

exports.getBlogEdit = async function (req, res) {
  const blogId = req.params.blogId;
  const authorId = req.session.author.id;

  const isAdmin = req.session.roles.includes("admin");

  try {
    const blog = await Blog.findOne({
      where: isAdmin ? { id: blogId } : { id: blogId, authorId: authorId },
      include: {
        model: Category,
        attributes: ["id"],
      },
    });
    const categories = await Category.findAll({ raw: true });

    if (blog) {
      return res.render("admin/blog-edit", {
        title: blog.title,
        blog: blog,
        categories: categories,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postBlogEdit = async function (req, res) {
  const blogId = req.body.blogId;
  const title = req.body.title;
  const shortDescription = req.body.shortDescription;
  const description = req.body.description;
  const categoryIds = req.body.categories;
  const url = req.body.url;
  let image = req.body.image; // resim varsa
  const authorId = req.session.author.id;

  if (req.file) {
    //resim yeni eklenmişse
    image = req.file.filename;

    fs.unlink("./public/images/" + req.body.image, (err) => {
      //guncelleme aşamasında eski resmi siler
      console.log(err);
    });
  }
  const homePage = req.body.homePage == "on" ? 1 : 0;
  const approved = req.body.approved == "on" ? 1 : 0;

  try {
    const blog = await Blog.findOne({
      where: isAdmin ? { id: blogId } : { id: blogId, authorId: authorId },
      include: {
        model: Category,
        attributes: ["id"],
      },
    });

    if (blog) {
      blog.title = title;
      blog.shortDescription = shortDescription;
      blog.description = description;
      blog.image = image;
      blog.url = url;
      blog.homePage = homePage;
      blog.approved = approved;

      if (categoryIds == undefined) {
        await blog.removeCategories(blog.categories);
      } else {
        await blog.removeCategories(blog.categories);
        const selectedCategories = await Category.findAll({
          where: {
            id: {
              [Op.in]: categoryIds,
            },
          },
        });
        await blog.addCategories(selectedCategories);
      }

      await blog.save();
      return res.redirect("/admin/blogs?action=update&blogId=" + blogId);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getCategoryEdit = async function (req, res) {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findByPk(categoryId);

    //lazy loading verilerin sırayla yüklenmesi durumu
    const blogs = await category.getBlogs(); // ilişkili tablolarda bu metodu sequelize sağlıyor Associations
    const countBlog = await category.countBlogs();

    if (category) {
      return res.render("admin/category-edit", {
        title: category.name,
        category: category,
        blogs: blogs,
        countBlog: countBlog,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postCategoryEdit = async function (req, res) {
  const categoryId = req.params.categoryId;
  const name = req.body.name;
  const icon = req.body.icon;

  try {
    await Category.update(
      { name: name, icon: icon },
      { where: { id: categoryId } }
    );

    return res.redirect(
      "/admin/categories?action=update&categoryId=" + categoryId
    );
  } catch (err) {
    console.log(err);
  }
};

exports.getBlogs = async function (req, res) {
  const authorId = req.session.author.id;
  console.log(req.session.roles);
  const isModerator = req.session.roles.includes("moderator");
  const isAdmin = req.session.roles.includes("admin");

  try {
    const blogs = await Blog.findAll({
      include: {
        model: Category,
        attributes: ["name"],
      },
      where: isModerator && !isAdmin ? { authorId: authorId } : null,
    });

    res.render("admin/blog-list", {
      title: "Admin Blog List",
      blogs: blogs,
      action: req.query.action,
      blogId: req.query.blogId,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCategories = async function (req, res) {
  try {
    const categories = await Category.findAll({ raw: true });

    console.log(categories);
    res.render("admin/category-list", {
      title: "Category List",
      categories: categories,
      action: req.query.action,
      categoryId: req.query.categoryId,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAuthorCreate = async function (req, res) {
  try {
    res.render("admin/author-create", {
      title: "Add Author",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAuthorStatusUpdate = async function (req, res) {
  const authorId = req.params.authorId;
  let approved = req.query.approved;

  approved = approved == 1 ? 0 : 1;

  try {
    const author = await Author.findOne({
      where: {
        id: authorId,
      },
    });

    if (author) {
      author.approved = approved;

      await author.save();
      res.redirect("/admin/authors?action=update");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postAuthorCreate = async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;
  const url = slugField(firstName + " " + lastName);
  const password = req.body.password;
  const email = req.body.email;
  const description = req.body.description;
  const image = req.file.filename;
  const ipAddress = req.socket.remoteAddress;

  try {
    //file.size ile dosya boyut kontrolü yapılabilir...

    await Author.create({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      url: url,
      password: password,
      email: email,
      description: description,
      image: image,
      ipAddress: ipAddress,
    });

    res.redirect("/admin/authors?action=create");
  } catch (err) {
    console.log(err);
  }
};

exports.getAuthors = async function (req, res) {
  try {
    const authors = await Author.findAll({
      include: {
        model: Role,
        attributes: ["roleName"],
      },
    });

    res.render("admin/author-list", {
      title: "Author List",
      authors: authors,
      action: req.query.action,
      authorId: req.query.authorId,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAuthorDelete = async function (req, res) {
  const authorId = req.params.authorId;

  try {
    const author = await Author.findByPk(authorId);

    res.render("admin/author-delete", {
      title: "Delete author",
      author: author,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postAuthorDelete = async function (req, res) {
  const authorId = req.body.authorId;
  try {
    await Author.destroy({
      where: {
        id: authorId,
      },
    });
    res.redirect("/admin/authors?action=delete");
  } catch (err) {
    console.log(err);
  }
};

exports.getAuthorEdit = async function (req, res) {
  const authorId = req.params.authorId;

  try {
    const author = await Author.findOne({
      where: { id: authorId },
    });

    if (author) {
      return res.render("admin/author-edit", {
        title: author.authorName,
        author: author,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.postAuthorEdit = async function (req, res) {
  const authorId = req.body.authorId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const authorName = req.body.authorName;
  const email = req.body.email;
  const url = req.body.url;
  const description = req.body.description;
  let image = req.body.image; // resim varsa

  if (req.file) {
    //resim yeni eklenmişse
    image = req.file.filename;

    fs.unlink("./public/images/" + req.body.image, (err) => {
      //guncelleme aşamasında eski resmi siler
      console.log(err);
    });
  }
  const approved = req.body.approved == "on" ? 1 : 0;

  try {
    const author = await Author.findOne({
      where: {
        id: authorId,
      },
    });

    if (author) {
      author.firstName = firstName;
      author.lastName = lastName;
      author.authorName = authorName;
      author.email = email;
      author.url = url;
      author.description = description;
      author.image = image;
      author.approved = approved;

      await author.save();
      return res.redirect("/admin/authors?action=update&authorId=" + authorId);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getMessages = async function (req, res) {
  try {
    const messages = await Message.findAll();

    res.render("admin/message-list", {
      title: "Admin Message List",
      messages: messages,
      action: req.query.action,
      messageId: req.query.messageId,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getMessageDelete = async function (req, res) {
  const messageId = req.params.messageId;

  try {
    const message = await Message.findByPk(messageId);

    res.render("admin/message-delete", {
      title: "Delete message",
      message: message,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postMessageDelete = async function (req, res) {
  const messageId = req.body.messageId;
  try {
    await Message.destroy({
      where: {
        id: messageId,
      },
    });
    res.redirect("/admin/messages?action=delete");
  } catch (err) {
    console.log(err);
  }
};

exports.getMessageEdit = async function (req, res) {
  const messageId = req.params.messageId;

  try {
    const message = await Message.findOne({
      where: { id: messageId },
    });

    if (message) {
      message.isViewed = true;
      await message.save();

      return res.render("admin/message-edit", {
        title: message.subject,
        message: message,
      });
    }

    return redirect("admin/messages");
  } catch (err) {
    console.log(err);
  }
};

exports.postMessageEdit = async function (req, res) {
  const messageId = req.body.messageId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const subject = req.body.subject;
  const reply = req.body.reply;

  try {
    const message = await Message.findOne({
      where: {
        id: messageId,
      },
    });

    if (message) {
      message.reply = reply;
      await message.save();

      emailService.sendMail({
        from: config.email.from,
        to: email,
        subject: subject,
        html: `Hi ${firstName} ${lastName} The response to your message is as follows: ${reply}`,
      });

      return res.redirect(
        "/admin/messages?action=update&messageId=" + messageId
      );
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getRoles = async function (req, res) {
  const roles = await Role.findAll({
    attributes: {
      include: [
        "role.id",
        "role.rolename",
        [sequelize.fn("COUNT", sequelize.col("authors.id")), "author_count"],
      ],
    },
    include: [{ model: Author, attributes: ["id"] }],
    group: ["role.id"],
    raw: true,
    includeIgnoreAttributes: false,
  });

  res.render("admin/role-list", {
    title: "Role List",
    roles: roles,
  });
};

exports.getRoleEdit = async function (req, res) {
  const roleId = req.params.roleId;
  try {
    const role = await Role.findByPk(roleId);
    const authors = await role.getAuthors();

    if (role) {
      return res.render("admin/role-edit", {
        title: "Role Details",
        role: role,
        authors: authors,
      });
    }
    res.redirect("admin/roles");
  } catch (err) {
    console.log(err);
  }
};

exports.postRoleEdit = async function (req, res) {
  const roleId = req.body.roleId;
  const roleName = req.body.roleName;

  try {
    await Role.update({ roleName: roleName }, { where: { id: roleId } });
    return res.redirect("/admin/roles");
  } catch (err) {
    console.log(err);
  }
};

exports.postRoleDelete = async function (req, res) {
  const roleId = req.body.roleId;
  try {
    await Role.destroy({
      where: {
        id: roleId,
      },
    });
    res.redirect("/admin/roles?action=delete");
  } catch (err) {
    console.log(err);
  }
};

exports.getTestPage = async function (req, res) {
  try {
    const categories = await Category.findAll();
    res.render("admin/test", {
      title: "Add Blog",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
  }
};
