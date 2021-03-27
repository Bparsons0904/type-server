import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ name: "passwordResets" })
export class PasswordReset extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @CreateDateColumn()
  createdAt: string;
}
