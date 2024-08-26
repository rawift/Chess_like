const express = require("express");
const {
  signup,
  login,
  verifyToken,
  getUser,
  refreshToken,
  logout,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getUser);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.get("/logout", verifyToken, logout);


module.exports = router;
