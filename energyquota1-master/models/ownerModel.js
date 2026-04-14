const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone_number: {
      type: Number,
      trim: true,
      required: true,
    },
    meter_number: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tenants: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving it
ownerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//model from userSchema

const Owner = mongoose.model("Owner", ownerSchema);

// exporting

module.exports = Owner;
