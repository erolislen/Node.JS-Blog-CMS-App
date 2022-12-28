const Blog = require("../models/blog");
const Category = require("../models/category");
const Author = require("../models/author");
const Message = require("../models/message");

const moment = require("moment");

const { Op } = require("sequelize"); // Operatörlerin yüklenmesi and - or

exports.getSearch = async function (req, res) {
  const keyword = req.query.keyword;
  console.log(keyword);
  try {
    const blogs = await Blog.findAll({
      where: {
        title: {
          [Op.like]: `%${keyword}%`,
        },
      },
      raw: true,
    });
    const categories = await Category.findAll({ raw: true });
    const authors = await Author.findAll({ raw: true });

    res.render("users/search", {
      title: `${keyword} - Search Result`,
      blogs: blogs,
      categories: categories,
      selectedCategory: null,
      authors: authors,
      moment: moment,

    });
  } catch (err) {
    next(err);
  }
};

exports.getContact = async function (req, res) {
  const message = req.session.message;
  delete req.session.message;

  res.render("users/contact", {
    title: "Contact Us",
    message: message,
  });
};

exports.postContact = async function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const subject = req.body.subject;
  const content = req.body.content;
  const ipAddress = req.socket.remoteAddress;

  try {
    await Message.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      subject: subject,
      content: content,
      ipAddress: ipAddress,
    });

    return res.render("users/contact", {
      title: "Contact Us",
      message: {
        text: "Your message has been sent successfully",
        type: "success",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.blogDetails = async function (req, res) {
  const slug = req.params.slug;

  try {
    const blog = await Blog.findOne({
      where: { url: slug, approved: 1 },
      include: Author,
    });

    const categories = await Category.findAll();
    const authors = await Author.findAll({ raw: true });

    if (blog) {
      return res.render("users/blog-details", {
        // return yazma sebebimiz kod aşağıya redirect'e gitmesin...
        title: blog.title,
        blog: blog,
        categories: categories,
        selectedCategory: null,
        moment: moment,
        authors: authors,
      });
    }
    res.redirect("/404");
  } catch (err) {
    console.log(err);
  }
};

exports.blogList = async function (req, res) {
  const size = 4;
  const { page = 0 } = req.query; //default olarak 0 atandı!
  const slug = req.params.slug;

  try {
    const { rows, count } = await Blog.findAndCountAll({
      where: { approved: { [Op.eq]: true } },
      raw: true,
      include: slug ? { model: Category, where: { url: slug } } : null,
      limit: size,
      offset: page * size,
    });
    const categories = await Category.findAll({ raw: true });
    const authors = await Author.findAll({ raw: true });

    res.render("users/blogs", {
      title: "All Blogs",
      blogs: rows,
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      categories: categories,
      selectedCategory: slug,
      moment: moment,
      authors: authors,

    });
  } catch (err) {
    console.log(err);
  }
};

exports.index = async function (req, res) {
  try {
    const blogs = await Blog.findAll({
      //await ile işlemlerin bitmesi beklenir daha sonra diğer işleme geçilir.
      where: {
        [Op.and]: [{ approved: true }, { homePage: true }],
      },
      raw: true, // extra parametlerin getirilmesini önler...
    });

    const featuredBlogs = await Blog.findAll({
      limit: 1,
      where: {
        [Op.and]: [{ approved: true }, { homePage: true }],
      },
      order: [["createdAt", "DESC"]],
      raw: true, // extra parametlerin getirilmesini önler...
    });

    const categories = await Category.findAll();
    const authors = await Author.findAll();
    res.render("users/index", {
      title: "Blog App",
      blogs: blogs,
      featuredBlogs: featuredBlogs,
      categories: categories,
      selectedCategory: null,
      isAuth: req.session.isAuth,
      authors: authors,
      moment: moment,
    });
  } catch (err) {
    console.log(err);
  }
};
