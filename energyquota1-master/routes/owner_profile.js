const express = require("express");
const { isAuth } = require("../middleware/authMiddleware");
const router = express.Router();

const {
  getOwnerProfile,
  postOwenerChangePassword,
} = require("../controllers/owner_profile");

router.get("", isAuth, getOwnerProfile);
router.post("/change_password", isAuth, postOwenerChangePassword);

module.exports = router;
