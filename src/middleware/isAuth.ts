import { MiddlewareFn } from "type-graphql";
import { Context } from "../types";

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  console.log(context.me);

  if (!context.me) {
    throw new Error("Not authenticated");
  }

  return next();
};
