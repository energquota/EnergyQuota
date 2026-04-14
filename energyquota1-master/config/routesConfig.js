const indexRouter = require("../routes/index");
const ownersRouter = require("../routes/owners");
const dashboardRouter = require("../routes/dashboard");
const devicesRouter = require("../routes/devices");
const tenantsRouter = require("../routes/tenants");
const ownerProfileRouter = require("../routes/owner_profile");
const tenantAccountRouter = require("../routes/tenants_account");
const tenantDashboardRouter = require("../routes/tenant_dashboard");
const tenantProfileRouter = require("../routes/tenant_profile");
const tenantRechargeRouter = require("../routes/tenant_recharge");

module.exports = function (app) {
  app.use("/", indexRouter);
  app.use("/owners", ownersRouter);
  app.use("/owner_profile", ownerProfileRouter);
  app.use("/dashboard", dashboardRouter);
  app.use("/tenants", tenantsRouter);
  app.use("/devices", devicesRouter);
  app.use("/tenants_account", tenantAccountRouter);
  app.use("/tenant_dashboard", tenantDashboardRouter);
  app.use("/tenant_profile", tenantProfileRouter);
  app.use("/tenant_recharge", tenantRechargeRouter);
};
