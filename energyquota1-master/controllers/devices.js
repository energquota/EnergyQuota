const { getSocketIO } = require("../socketHandler");
const Recharge = require("../models/rechargeModel");
const Tenant = require("../models/tenantModel");
const {
  subtractUsage,
  addUnits,
  toStorageString,
  sumStored,
} = require("../utils/units");

const io = getSocketIO();

/**
 * Device data handler: deduct reported usage from each tenant's balance.
 * All calculations use high-precision decimals (no rounding before save)
 * so small consumptions (e.g. 0.00000001 kWh) are billed correctly and
 * we avoid "free energy" from floating-point rounding errors.
 * Tenant isolation: each tenant's balance is updated independently.
 */
const handleDeviceData = async (req, res) => {
  const { meter_number, tenants } = req.body;

  try {
    const new_tenants = [];

    for (const tenant of tenants) {
      const tenant_db = await Tenant.findOne({ tenant_id: tenant.tenant_id });
      if (!tenant_db) {
        console.log(`Tenant not found: ${tenant.tenant_id}`);
        continue;
      }

      const remaining = await Recharge.findOne({ tenant: tenant_db._id });
      if (!remaining) {
        console.log(`Remaining units not found for tenant: ${tenant.tenant_id}`);
        continue;
      }

      // High-precision deduction: remaining -= units_used, used += units_used
      // Never round or truncate; store full precision (at least 8 decimals).
      const new_remaining = subtractUsage(
        remaining.remaining_units,
        tenant.units_used
      );
      const new_used = addUnits(remaining.used_units, tenant.units_used);

      const remainingStr = toStorageString(new_remaining);
      const usedStr = toStorageString(new_used);

      await Recharge.findOneAndUpdate(
        { tenant: tenant_db._id },
        {
          $set: {
            remaining_units: remainingStr,
            used_units: usedStr,
          },
        },
        { new: true }
      );

      new_tenants.push({
        tenant_id: tenant_db.tenant_id,
        remaining_units: remainingStr,
      });

      meter_data = {
        remaining: remainingStr,
        used: usedStr,
      };
      io.to(tenant_db.tenant_id).emit("data", meter_data);
    }

    // Aggregate all tenants for this meter (high-precision sum)
    const all_units = await Recharge.find({ meter_number });

    const all_used = sumStored(all_units.map((u) => u.used_units));
    const all_remaining = sumStored(all_units.map((u) => u.remaining_units));

    all_tenants = {
      used: toStorageString(all_used),
      remaining: toStorageString(all_remaining),
    };
    io.to(meter_number).emit("all_data", all_tenants);

    return res.json({
      meter_number,
      tenants: new_tenants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleDeviceData,
};
