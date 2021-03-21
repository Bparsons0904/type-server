import { Request, Response } from "express";
import { User } from "./entities/User";
// import { Field, Float, Int, ObjectType } from "type-graphql";

export interface Context {
  req: Request;
  res: Response;
  me: User;
  token: string;
}
