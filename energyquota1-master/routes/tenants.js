const express = require("express");
const router = express.Router();

const { isAuth } = require("../middleware/authMiddleware");
const {
  getTenants,
  getTenantsRegister,
  postTenantRegister,
  getTenantEdit,
  putTenantEdit,
  deleteTenant,
  getTenantsDownload,
} = require("../controllers/tenants");

router.get("/", isAuth, getTenants);
router.get("/register", isAuth, getTenantsRegister);
router.post("/register", isAuth, postTenantRegister);
router.get("/edit/:id", isAuth, getTenantEdit);
router.post("/edit/:id", isAuth, putTenantEdit);
router.post("/delete", isAuth, deleteTenant);
router.get("/download_tenants", isAuth, getTenantsDownload);

module.exports = router;
