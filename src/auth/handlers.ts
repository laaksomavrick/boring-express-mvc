import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { Handler, response } from "../api";
import config from "../config";
import { Core } from "../core";
import { ForbiddenError, NotFoundError } from "../errors";
import { findByEmail } from "../users/repository";

export const get = (core: Core): Handler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      return res.render("login.html");
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Issues a JWT for a valid username and password.
 */
export const create = ({ db, crypto }: Core): Handler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        body: {
          auth: { email, password },
        },
      } = req;
      const user = await findByEmail(db, email);
      if (!user) {
        return res.render("login.html", {
          // todo make better
          errors: [{ param: "user", msg: "User does not exist" }],
        });
      }

      const authorized = await crypto.compare(password, user.password);
      if (!authorized) {
        return res.render("login.html", {
          // todo make better
          errors: [{ param: "password", msg: "Invalid password provided" }],
        });
      }
      req.session.user = user;
      return res.redirect("/");
    } catch (error) {
      next(error);
    }
  };
};
