import { MiddlewareFn } from "type-graphql";
import { Context } from "../types";
import { User } from "./../entities/User";

/**
 * Validate if token provided is for an admin
 * @param context Include token data including user id
 * @param next
 * @returns next() if valid else error
 */
export const isAdmin: MiddlewareFn<Context> = async ({ context }, next) => {
  if (!context?.me) {
    throw new Error("No Admin Token Provided");
  }
  const user: User | undefined = await User.findOne(
    { id: context.me.id },
    { relations: ["profile"] }
  );
  console.log(user?.profile?.role);

  if (user?.profile.role !== "admin") {
    throw new Error("Not an admin");
  }

  return next();
};
