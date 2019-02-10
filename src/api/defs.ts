import { NextFunction, Request, Response } from "express";
import { User } from "../users/repository";

/**
 * Type defining the function signature of handlers or middlewares.
 */
export type Handler = ((
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>);

/**
 * Interface defining the shape of a request which has a userId associated with it.
 * Used post authorization middleware.
 */
export interface AuthorizedRequest extends Request {
  user: User;
  userId: number; // todo remove
}
