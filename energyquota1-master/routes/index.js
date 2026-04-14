var express = require("express");
var router = express.Router();
const { getLanding } = require("../controllers/index");

router.get("/", getLanding);

module.exports = router;
