const express = require("express");
const router = express.Router();

const { isAuth } = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/dashboard");

router.get("/", isAuth, getDashboard);

module.exports = router;
