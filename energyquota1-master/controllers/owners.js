const Owner = require("../models/ownerModel");

const getRegisterUser = (req, res) => {
  return res.render("register", {
    message: "",
  });
};

const getLoginUser = (req, res) => {
  return res.render("login", {
    message: req.flash("error"),
  });
};

const postRegisterUser = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    meter_number,
    password,
    confirm_password,
  } = req.body;

  if (
    !full_name ||
    !email ||
    !phone_number ||
    !meter_number ||
    !password ||
    !confirm_password
  ) {
    return res.status(400).render("register", {
      message: "Please provide all the inputs",
    });
  }

  // check if passwords match
  if (password !== confirm_password) {
    return res.status(400).render("register", {
      message: "Passwords do not match",
    });
  }

  // check user exist
    const owner = await Owner.find({ $or: [ { email: email}, {meter_number: meter_number}] });
    
    if (owner.length !== 0) {
      return res.render("register", {
        message: "Email or meter number already taken",
      });
    }

  await Owner.create({
    full_name,
    email,
    phone_number,
    meter_number,
    password,
  })
    .then((owner) => {
      return res.status(201).render("register", {
        message: "User registered succefully. Login to continue",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const logOutUser = (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
    }
    return res.render("login", {
      message: "You are logged out.",
    });
  });
};

module.exports = {
  getRegisterUser,
  getLoginUser,
  postRegisterUser,
  logOutUser,
};
