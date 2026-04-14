const Tenant = require("../models/tenantModel");
const Recharge = require("../models/rechargeModel");
const { toDecimal10, toDisplay2 } = require("../utils/units");


const getDashboard = async (req, res) => {
  const user = req.user;
  const number_tenants = await Tenant.countDocuments({ house_owner: user._id });
  const all_units = await Recharge.find({ meter_number: user.meter_number })

  if( !all_units ){

    return res.render("owner_dashboard", {
      user,
      currentPage: "dashboard",
      number_tenants,
      all_used: 0,
      all_remaining: 0
    })
    
  }
        
  var all_used  = 0;
  var all_remaining = 0;

  all_units.forEach((unit) => {
    all_used += Number(unit.used_units);
    all_remaining += Number(unit.remaining_units);
  });

  // Calculations use full precision; display 2 decimal places for readability
  res.render("owner_dashboard", {
    user,
    currentPage: "dashboard",
    number_tenants,
    all_used: toDisplay2(all_used),
    all_remaining: toDisplay2(all_remaining),
  });
};

module.exports = {
  getDashboard,
};
