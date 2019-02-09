import { NextFunction, Request, Response } from "express";
import { Handler } from "../api";
import { Core } from "../core";

export const get = (core: Core): Handler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.render("home.html", { email: req.session.user.email });
    } catch (error) {
      next(error);
    }
  };
};
