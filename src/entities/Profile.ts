import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

@ObjectType()
@Entity({ name: "profiles" })
export class Profile extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

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

  @Field()
  @Column({ type: "float" })
  phone: number;

  @Field()
  @Column()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @Field()
  @Column({ default: null })
  image: string;

  @Field()
  @Column({ default: null })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
