const Recharge = require("../models/rechargeModel");
const { addUnits, toStorageString } = require("../utils/units");

const getRechargePage = (req, res) => {
  const user = req.user;
  return res.render("tenant_recharge", {
    user,
    currentPage: "tenant_recharge",
    message: "",
  });
};

/**
 * Add purchased units to tenant balance. High-precision; no rounding before save.
 * Stored value has at least 8 decimal places so small recharges and deductions
 * (e.g. lighting loads) are accurate and we avoid unbilled consumption.
 */
const postBuyUnits = async (req, res) => {
  const user = req.user;
  const { units_value } = req.body;

  const recharge_present = await Recharge.findOne({ tenant: user.id });
  if (recharge_present) {
    const new_remaining = addUnits(
      recharge_present.remaining_units,
      units_value
    );
    recharge_present.remaining_units = toStorageString(new_remaining);
    recharge_present.units.push(units_value);
    recharge_present.save();

    return res.render("tenant_recharge", {
      user,
      currentPage: "tenant_recharge",
      message: "units bought successfully",
    });
  }

  const recharge = new Recharge({
    units: units_value,
    remaining_units: toStorageString(units_value),
    tenant: user._id,
    meter_number: user.meter_number,
    used_units: toStorageString(0),
  });
  recharge.save();

  return res.render("tenant_recharge", {
    user,
    currentPage: "tenant_recharge",
    message: "Units bought successfully",
  });
};

module.exports = {
  getRechargePage,
  postBuyUnits,
};
