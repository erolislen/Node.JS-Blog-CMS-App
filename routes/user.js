const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.get("/search", userController.getSearch);

router.post("/contact", userController.postContact);

router.get("/contact",userController.getContact);

router.get("/blogs/category/:slug", userController.blogList);

router.get("/blogs/:slug", userController.blogDetails);

router.get("/blogs", userController.blogList);

router.get("/", userController.index);

module.exports = router;
