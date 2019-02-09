import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express, { Express } from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import nunjucks from "nunjucks";
import auth from "../auth";
import config from "../config";
import { db } from "../db";
import folders from "../folders";
import healthz from "../healthz";
import home from "../home";
import logger from "../logger";
import notes from "../notes";
import search from "../search";
import users from "../users";
import { Core } from "./defs";
import { globalErrorHandler } from "./middlewares";

// todo: default request timeout

export const bootstrap = (): Express => {
  const app = express();
  nunjucks.configure([config.get("viewsPath")], {
    autoescape: true,
    express: app,
    watch: config.get("env") === "development",
  });
  if (config.get("env") !== "test") {
    app.use(morgan("combined")); // todo write to file in prod
  }
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(cookieParser());
  app.use(
    // todo investigate these settings
    // todo redis
    session({
      secret: "todo some secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: false,
      },
    }),
  );
  wireApp(app);
  // todo
  app.get("*", (req, res) => {
    res.redirect("/");
  });
  app.use(globalErrorHandler);
  return app;
};

const wireApp = (app: Express): void => {
  const core: Core = {
    db,
    logger,
    crypto: bcrypt,
  };
  // todo put these in array, inject with loop
  search(core)(app);
  notes(core)(app);
  folders(core)(app);
  users(core)(app);
  healthz(core)(app);
  auth(core)(app);
  home(core)(app);
};
