const express = require("express");
const router = express.Router();

const { isAuth } = require("../middleware/authMiddleware");
const {
  getTenantProfile,
  postTenantChangePassword,
} = require("../controllers/tenant_profile");

router.get("/", isAuth, getTenantProfile);
router.post("/change_password", isAuth, postTenantChangePassword);

module.exports = router;
