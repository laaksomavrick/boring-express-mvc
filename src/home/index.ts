import { Express } from "express";
import { authorize, Core } from "../core";
import { get } from "./handlers";

/**
 * Module exposing authorization routes and their handlers.
 */
export default (core: Core): ((app: Express) => void) => {
  return (app: Express): void => {
    app.get("/", authorize, get(core));
  };
};
