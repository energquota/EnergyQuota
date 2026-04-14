const bcrypt = require("bcryptjs");
const Owner = require("../models/ownerModel");

const getOwnerProfile = (req, res) => {
  const user = req.user;

  return res.render("owner_profile", {
    user,
    currentPage: "owner_profile",
    message: "",
  });
};

const postOwenerChangePassword = async (req, res) => {
  const { old_password, password, confirm_password } = req.body;
  const user = req.user;

  // check all the inputs
  if (!old_password || !password || !confirm_password) {
    return res.render("owner_profile", {
      user,
      currentPage: "owner_profile",
      message: "Please fill all the fields",
    });
  }

  //check for valid current password
  console.log(user.password);
  const currentValid = await bcrypt.compare(old_password, user.password);
  console.log(currentValid);

  if (!currentValid) {
    return res.render("owner_profile", {
      user,
      currentPage: "owner_profile",
      message: "Invalid current password",
    });
  }

  //Compare the passwords
  if (password !== confirm_password) {
    return res.render("owner_profile", {
      user,
      currentPage: "owner_profile",
      message: "Password does not match",
    });
  }

  // update new password
  try {
    const user_account = await Owner.findOne({ _id: user.id });
    user_account.password = password;

    await user_account.save();
    return res.render("owner_profile", {
      user,
      currentPage: "owner_profile",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getOwnerProfile,
  postOwenerChangePassword,
};
