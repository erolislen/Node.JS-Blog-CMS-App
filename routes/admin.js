const express = require("express");
const router = express.Router();

//image upload helper
const imageUpload = require("../helpers/image-upload");

//isAdmin middleware
const isAdmin = require("../middlewares/isAdmin");
const isModerator = require("../middlewares/isModerator");

//contoller
const adminController = require("../controllers/admin");


router.get("/test", adminController.getTestPage);

//Dashboard Routes
router.get("/dashboard", isModerator, adminController.getDashboard);

///Blog Routes
router.get("/blog/updateStatus/:blogId",isModerator,adminController.postBlogStatusUpdate);

router.get("/blog/delete/:blogId", isModerator, adminController.getBlogDelete);

router.post("/blog/delete/:blogId", isModerator, adminController.postBlogDelete);

router.get("/blog/create", isModerator, adminController.getBlogCreate);

router.post("/blog/create",isModerator,imageUpload.upload.single("image"),adminController.postBlogCreate);

router.get("/blogs/:blogId", isModerator,adminController.getBlogEdit);

router.post("/blogs/:blogId",isModerator,imageUpload.upload.single("image"),adminController.postBlogEdit);

router.get("/blogs", isModerator, adminController.getBlogs);

///Category Routes

router.get("/category/delete/:categoryId",isAdmin,adminController.getCategoryDelete);

router.post("/category/delete/:categoryId",isAdmin,adminController.postCategoryDelete);

router.get("/categories", isAdmin, adminController.getCategories);

router.get("/category/create", isAdmin, adminController.getCategoryCreate);

router.post("/category/create", isAdmin, adminController.postCategoryCreate);

router.get("/categories/:categoryId",isAdmin,adminController.getCategoryEdit);

router.post("/categories/:categoryId",isAdmin,adminController.postCategoryEdit);

//Author Routes

router.get("/author/updateStatus/:authorId",isAdmin,adminController.postAuthorStatusUpdate);

router.get("/author/delete/:authorId",isAdmin,adminController.getAuthorDelete);

router.post("/author/delete/:authorId",isAdmin,adminController.postAuthorDelete);

router.get("/authors/:authorId", isAdmin, adminController.getAuthorEdit);

router.post("/authors/:authorId",isAdmin,imageUpload.upload.single("image"),adminController.postAuthorEdit);

router.get("/author/create", isAdmin, adminController.getAuthorCreate);

router.post("/author/create",isAdmin,imageUpload.upload.single("image"),adminController.postAuthorCreate);

router.get("/authors", isAdmin, adminController.getAuthors);

// Message Routes
router.get("/messages", isAdmin, adminController.getMessages);

router.get("/messages/delete/:messageId",isAdmin,adminController.getMessageDelete);

router.post("/messages/delete/:messageId",isAdmin,adminController.postMessageDelete);

router.get("/messages/:messageId",isAdmin,adminController.getMessageEdit);

router.post("/messages/:messageId", isAdmin, adminController.postMessageEdit);

//Role route
router.get("/roles", isAdmin, adminController.getRoles);
router.get("/roles/:roleId", isAdmin, adminController.getRoleEdit);
router.post("/roles/:roleId", isAdmin, adminController.postRoleEdit);
router.post("/roles/delete/:roleId", isAdmin, adminController.postRoleDelete);



module.exports = router;
