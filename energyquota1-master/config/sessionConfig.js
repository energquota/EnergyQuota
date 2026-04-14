const MongoStore = require("connect-mongo");
const session = require("express-session");

module.exports = function (app) {
  const sessionConfig = {
    secret: process.env.SESSION_SECRETE || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // Stays for 30 minute
    },
  };

  // Only use MongoStore when MongoDB URL is set (e.g. from .env or Docker)
  if (process.env.MONGO_DB_URI) {
    sessionConfig.store = MongoStore.create({ mongoUrl: process.env.MONGO_DB_URI });
  }

  app.use(session(sessionConfig));
};
