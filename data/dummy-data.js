const Category = require("../models/category");
const Blog = require("../models/blog");
const Author = require("../models/author");
const Role = require('../models/role');
const slugField = require("../helpers/slugfield");
const bcrypt = require("bcrypt");

async function populate() {
  // örnek verilerin kaydedilmesi
  const count = await Category.count();

  if (count == 0) {
    const authors = await Author.bulkCreate([
      {
        firstName: "Erol",
        lastName: "İŞLEN",
        userName: "erolislen",
        email: "erolislen@gmail.com",
        password: await bcrypt.hash("123456", 10),
        url: slugField("Erol İŞLEN"),
        description: "Açıklama Alanı",
        image: "user.png",
        ipAddress: "127.0.0.1",
        approved: 1,
      },
      {
        firstName: "Test",
        lastName: "User",
        userName: "testuser",
        email: "erolislen@yandex.com",
        password: await bcrypt.hash("123456", 10),
        url: slugField("Test User"),
        description: "Açıklama Alanı",
        image: "user.png",
        ipAddress: "127.0.0.1",
        approved: 1,
      },
    ]);

    const roles = await Role.bulkCreate([
      { roleName: "admin" },
      { roleName: "moderator" },
      { roleName: "guest" },
    ]);

    await authors[0].addRole(roles[0]);
    await authors[1].addRole(roles[1]);

    const categories = await Category.bulkCreate([
      {
        name: "Blog Category 1",
        icon: "fa fa-home",
        url: slugField("Blog Category 1"),
      },
      {
        name: "Blog Category 2",
        icon: "fa fa-laptop",
        url: slugField("Blog Category 2"),
      },
      {
        name: "Blog Category 3",
        icon: "fa fa-envelope",
        url: slugField("Blog Category 3"),
      },
    ]);

    const blogs = await Blog.bulkCreate([
      {
        title: "Example Blog Title 1",
        url: slugField("Example Blog Title 1"),
        shortDescription:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "1.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Example Blog Title 2",
        url: slugField("Example Blog Title 2"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "2.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Example Blog Title 3",
        url: slugField("Example Blog Title 3"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "3.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Example Blog Title 4",
        url: slugField("Example Blog Title 4"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "4.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Example Blog Title 5",
        url: slugField("Example Blog Title 5"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "5.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Example Blog Title 6",
        url: slugField("Example Blog Title 6"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "6.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Example Blog Title 7",
        url: slugField("Example Blog Title 7"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "7.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Example Blog Title 8",
        url: slugField("Example Blog Title 8"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "8.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Example Blog Title 9",
        url: slugField("Example Blog Title 9"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "9.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Example Blog Title 10",
        url: slugField("Example Blog Title 10"),
        shortDescription:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image: "10.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
    ]);

    await categories[0].addBlog(blogs[0]);
    await categories[0].addBlog(blogs[1]);
    await categories[0].addBlog(blogs[2]);
    await categories[0].addBlog(blogs[3]);
    await categories[0].addBlog(blogs[4]);
    await categories[0].addBlog(blogs[5]);
    await categories[0].addBlog(blogs[6]);
    await categories[0].addBlog(blogs[7]);
    await categories[0].addBlog(blogs[8]);
    await categories[0].addBlog(blogs[9]);

    await categories[1].addBlog(blogs[2]);
    await categories[1].addBlog(blogs[3]);

    await categories[2].addBlog(blogs[2]);
    await categories[2].addBlog(blogs[3]);

    await blogs[0].addCategory(categories[1]);
  }
}

module.exports = populate;
