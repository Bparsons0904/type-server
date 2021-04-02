import { Request, Response } from "express";
import { User } from "../entities/User";
import { Field, ObjectType, InputType, Float } from "type-graphql";

// Interface for getting @ctx variables from context
export interface Context {
  req: Request;
  res: Response;
  me: User;
  token: string;
}

////////////////////////////////////////////////////////
// User Custom Types
////////////////////////////////////////////////////////
@ObjectType()
export class UserLogin {
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => String, { nullable: true })
  token: string;
}

////////////////////////////////////////////////////////
// Profile Custom Types
////////////////////////////////////////////////////////
@InputType()
export class ProfileInput {
  @Field({ nullable: true })
  id?: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  image?: string;
  @Field({ nullable: true })
  role?: string;
  @Field(() => Float, { nullable: true })
  phone?: number;
}

////////////////////////////////////////////////////////
// Products Custom Types
////////////////////////////////////////////////////////
@InputType()
export class ProductInput {
  @Field({ nullable: true })
  id?: string;
  @Field()
  title: string;
  @Field()
  description: string;
  @Field({ nullable: true })
  image?: string;
  @Field({ nullable: true })
  video?: string;
  @Field(() => Float, { nullable: true })
  cost: number;
  @Field(() => Float, { nullable: true })
  user?: User;
}
