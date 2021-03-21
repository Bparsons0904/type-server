import { MiddlewareFn } from "type-graphql";
import { Context } from "../types";

export const isAdmin: MiddlewareFn<Context> = ({ context }, next) => {
  console.log(context?.me);

  if (context.me?.profile?.role !== "admin") {
    throw new Error("Not admin");
  }

  return next();
};
