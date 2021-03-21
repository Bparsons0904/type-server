import { MiddlewareFn } from "type-graphql";
import { Context } from "../types";

/**
 * Validate if token provided is for an user
 * @param context Include token data including user id
 * @param next
 * @returns next() if valid else error
 */
export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.me) {
    throw new Error("Not authenticated");
  }
  return next();
};
