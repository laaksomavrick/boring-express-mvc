import { NextFunction, Request, Response } from "express";

/**
 * Validator for the create handler.
 * A username and password should exist on an incoming request.
 */
export const validateLoginForm = (
  { body: { auth: { email = null, password = null } = {} } }: Request,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // todo: validator.js
    const valid = email !== null && password !== null;
    if (!valid) {
      return res.render("login.html", {
        // todo make better
        errors: [{ param: "input", msg: "Invalid input provided" }],
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
