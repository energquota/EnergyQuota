const Owner = require("../models/ownerModel");
const Recharge = require("../models/rechargeModel");
const { toDisplay2 } = require("../utils/units");

const getTenantDashboard = async (req, res) => {
  const user = req.user;
  const owner = await Owner.findOne({ _id: user.house_owner });
  const recharge = await Recharge.findOne({ tenant: user._id });
  // Display 2 decimal places for usability and readability (data stored with 10 decimals)
  const remaining_units = recharge !== null ? toDisplay2(recharge.remaining_units) : "0.00";
  const used_units = recharge !== null ? toDisplay2(recharge.used_units) : "0.00";

  // remaining units

  return res.render("tenant_dashboard", {
    user,
    currentPage: "tenant_dashboard",
    owner,
    remaining_units,
    used_units,
  });
};

module.exports = {
  getTenantDashboard,
};
