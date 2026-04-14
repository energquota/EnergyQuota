const express = require("express");
const router = express.Router();
const { handleDeviceData } = require("../controllers/devices");

router.post("/", handleDeviceData);

module.exports = router;
