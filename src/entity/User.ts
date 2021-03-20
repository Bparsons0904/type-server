import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  Index,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import bcrypt from "bcrypt";
import { Profile } from "./Profile";

@ObjectType()
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  @Index()
  id: string;

  @Field()
  @Column({ unique: true })
  @Length(6, 30, {
    message:
      "The username must be at least 6 but not longer than 30 characters",
  })
  @IsNotEmpty({ message: "Username is required" })
  @Index()
  username: string;

  @Field()
  @Column({ unique: true })
  @IsEmail({}, { message: "Incorrect email format" })
  @IsNotEmpty({ message: "Email is required" })
  @Length(6, 30, {
    message: "The email must be at least 6 but not longer than 30 characters",
  })
  email: string;

  @Column()
  @IsNotEmpty({ message: "Password is required" })
  @Length(8, 30, {
    message:
      "The password must be at least 8 but not longer than 30 characters",
  })
  password: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @BeforeInsert()
  /**
   * Hash the password before storing and normalize username and email
   * by making all lowercase
   */
  async insertNewUser(): Promise<void> {
    this.password = await this.generatePasswordHash(this.password);
    this.username = this.username.toLowerCase();
    this.email = this.email.toLowerCase();
  }

  /**
   * Create a hashed password using bcrypt
   * @param password User entered password
   * @returns Hashed password
   */
  async generatePasswordHash(password: string): Promise<string> {
    const saltRounds: string = process.env.SALTROUNDS ?? "15";
    return await bcrypt.hash(password, parseInt(saltRounds));
  }

  /**
   * Validate password vs hashed password in DB using bcrypt
   * @param password User entered password
   * @returns Success status of validation
   */
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
