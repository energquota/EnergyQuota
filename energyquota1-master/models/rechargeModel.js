const mongoose = require("mongoose");

const rechargeSchema = mongoose.Schema(
    {
      remaining_units: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
      used_units: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
      },
      tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
      },
      meter_number: {
        type: String,
        required: true,
        trim: true,
      },
      units: [],
    },{
        timestamps: true,
    }
)

const Recharge = mongoose.model("Recharge", rechargeSchema);

module.exports = Recharge;

