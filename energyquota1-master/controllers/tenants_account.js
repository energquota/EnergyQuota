const getTenantLogin = (req, res) => {
  return res.render("tenant_login", {
    message: req.flash("error"),
  });
};
const logOutTenant = (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
    }
    return res.render("tenant_login", {
      message: "You are logged out.",
    });
  });
};

module.exports = {
  getTenantLogin,
  logOutTenant,
};
