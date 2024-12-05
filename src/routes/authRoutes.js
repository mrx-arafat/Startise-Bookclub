const express = require("express");
const router = express.Router();
const {
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
