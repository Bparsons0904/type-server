import { Entity, Column } from "typeorm";
import { Base } from "../Model/Base";
import { Field, ObjectType, Float } from "type-graphql";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

@ObjectType()
@Entity({ name: "profiles" })
export class Profile extends Base {
  @Field()
  @Column()
  @Length(2, 30, {
    message: "First name must be at least 2 but not longer than 30 characters",
  })
  @IsNotEmpty({ message: "First name is required" })
  firstName: string;

  @Field()
  @Column()
  @Length(2, 30, {
    message: "Last name must be at least 2 but not longer than 30 characters",
  })
  @IsNotEmpty({ message: "Last name is required" })
  lastName: string;

  @Field()
  @Column()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Incorrect email format" })
  @Length(8, 30, {
    message: "Email must be at least 8 but not longer than 30 characters",
  })
  email: string;

  @Field(() => Float)
  @Column({ type: "float" })
  @IsNotEmpty({ message: "Phone is required" })
  phone: number;

  @Field()
  @Column()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  image: string;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  role: string;
}
