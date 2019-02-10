import { Express } from "express";
import { Core } from "../core";
import { create, get } from "./handlers";
import { validateLoginForm } from "./middlewares";

/**
 * Module exposing authorization routes and their handlers.
 */
export default (core: Core): ((app: Express) => void) => {
  return (app: Express): void => {
    app.get("/login", get(core));
    app.post("/login", validateLoginForm, create(core));
  };
};
