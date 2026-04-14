const express = require("express");
const router = express.Router();

const { isAuth } = require("../middleware/authMiddleware");
const { getTenantDashboard } = require("../controllers/tenant_dashboard");

router.get("/", isAuth, getTenantDashboard);

module.exports = router;
