const LocalStrategy = require("passport-local").Strategy;
const Owner = require("../models/ownerModel");
const Tenant = require("../models/tenantModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");

module.exports = function () {
  //house owner authentication
  passport.use(
    "owner",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          //check user in the database
          const owner = await Owner.findOne({ email: email });

          if (owner) {
            // check passwords
            let isPasswordCorect = await bcrypt.compare(
              password,
              owner.password
            );
            if (owner && isPasswordCorect) {
              return done(null, owner);
            }
            return done(null, false, {
              message: "Incorrect email or password",
            });
          } else {
            return done(null, false, {
              message: "User not found.Please register",
            });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // tenant strategy
  passport.use(
    "tenant",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          //check user in the database
          const tenant = await Tenant.findOne({ email: email });

          if (tenant) {
            // check passwords
            let isPasswordCorect = await bcrypt.compare(
              password,
              tenant.password
            );
            if (tenant && isPasswordCorect) {
              return done(null, tenant);
            }
            return done(null, false, {
              message: "Incorrect email or password",
            });
          } else {
            return done(null, false, { message: "No Tenant account found" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, {
      id: user.id,
      type: user instanceof Owner ? "owner" : "tenant",
    });
  });

  passport.deserializeUser(async function (userObj, done) {
    if (userObj.type === "owner") {
      await Owner.findById(userObj.id)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err, null);
        });
    } else if (userObj.type === "tenant") {
      await Tenant.findById(userObj.id)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(err, null);
        });
    } else {
      done("Invalid user type", null);
    }
  });
};
