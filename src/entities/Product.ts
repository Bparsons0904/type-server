import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType, Float } from "type-graphql";
import { IsNotEmpty } from "class-validator";
import { User } from "../entities/User";

@ObjectType()
@Entity({ name: "products" })
export class Product extends BaseEntity {
  @Field({ nullable: true })
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Field({ nullable: true })
  @Column()
  @IsNotEmpty({ message: "Title is required" })
  title: string;

  @Field({ nullable: true })
  @Column()
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: "float" })
  @IsNotEmpty({ message: "Cost is required" })
  cost: number;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  image: string;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true })
  video: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn()
  user: User;
}
