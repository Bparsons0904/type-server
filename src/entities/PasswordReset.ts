import { Entity, Column } from "typeorm";
import { Base } from "../Model/Base";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ name: "passwordResets" })
export class PasswordReset extends Base {
  @Field()
  @Column()
  email: string;
}
