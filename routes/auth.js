const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get('/login',authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/reset-password',authController.getReset);
router.post('/reset-password', authController.postReset);

router.get('/new-password/:token',authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

router.get('/logout',authController.getLogout);

module.exports = router;
