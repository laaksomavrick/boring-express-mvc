import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AuthorizedRequest, renderError } from "../api";
import config from "../config";
import { ForbiddenError, UnauthorizedError } from "../errors";

/**
 * The top level error handler for the app.
 */
export const globalErrorHandler = (
  // tslint:disable-next-line:no-any
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = error.status || 500;
  renderError(res, error, status);
};

/**
 * Middleware used for protecting routes requiring authorization.
 * Checks the incoming request for a JWT. If it exists, populates the userId
 * on the request.
 */
export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      session: { user = null },
    } = req;
    if (!user) {
      res.redirect("/login");
    } else {
      (req as AuthorizedRequest).userId = user.id;
      next();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware used for validaing the userId of a route parameter against an
 * AuthorizedRequest's userId
 */
export const isUser = async (
  { params: { userId: paramUserId }, userId: authorizedUserId }: AuthorizedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (parseInt(paramUserId, 10) !== authorizedUserId) {
      throw new ForbiddenError();
    }
    next();
  } catch (error) {
    next(error);
  }
};
