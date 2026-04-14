const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const tenantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phone_number: {
      type: Number,
      trim: true,
    },
    house_number: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    house_owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tenant_id: {
      type: String,
      required: true,
      unique: true,
    },
    meter_number: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving it
tenantSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//model from userSchema

const Tenant = mongoose.model("Tenant", tenantSchema);

// exporting

module.exports = Tenant;
