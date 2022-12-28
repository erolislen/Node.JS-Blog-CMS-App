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
        name: "Web Geliştirme",
        icon: "fa fa-home",
        url: slugField("Web Geliştirme"),
      },
      {
        name: "Mobil Geliştirme",
        icon: "fa fa-laptop",
        url: slugField("Mobil Geliştirme"),
      },
      {
        name: "Programlama",
        icon: "fa fa-envelope",
        url: slugField("Programlama"),
      },
    ]);

    const blogs = await Blog.bulkCreate([
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "1.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "3.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "3.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "3.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "4.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "4.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "4.jpeg",
        homePage: true,
        approved: true,
        authorId: 2,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "3.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 2",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 2"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "4.jpeg",
        homePage: true,
        approved: true,
        authorId: 1,
      },
      {
        title: "Python ile Sıfırdan İleri Seviye Python Programlama 3",
        url: slugField("Python ile Sıfırdan İleri Seviye Python Programlama 3"),
        shortDescription:
          "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        description:
          "Python programlamanın popülerliğinden dolayı bir çok yazılımcı ve firma python için kütüphaneler oluşturup python kütüphane havuzunda paylaşmaktadır. Dolayısıyla python dünyasına giriş yaptığımızda işlerimizi kolaylaştıracak bazı imkanlara sahip oluyoruz.",
        image: "3.jpeg",
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
