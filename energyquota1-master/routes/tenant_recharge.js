const express = require('express');
const router = express.Router();

const { isAuth} = require("../middleware/authMiddleware")
const { getRechargePage, postBuyUnits } = require("../controllers/tenant_recharge")


router.get("/", isAuth, getRechargePage)
router.post("/units", isAuth, postBuyUnits)

module.exports = router;