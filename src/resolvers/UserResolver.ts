import { PasswordReset } from "./../entities/PasswordReset";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import {} from "module";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth";
import { EmailService } from "../helpers/EmailService";
import { Context, UserLogin } from "../helpers/types";

/**
 * Create jwt token for user auth
 * @param user Current user
 * @param secret JWT Secret string
 * @param expiresIn Time until token expires
 * @returns Token as a string
 */
const createToken = async (user: User) => {
  // Get values from the user
  const { id, email, username }: User = user;
  const secret: string = process.env.SECRET ?? "";
  const days: string = process.env.TOKEN_DAYS ?? "90";
  const expiresIn: string = `${days} days`;
  const token: string = await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
  // Create signed token
  return token;
};

@Resolver()
export class UserResolver {
  /**
   * Get current user with profile
   * @param me User returned from the token auth
   * @returns User data plus profile
   */
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async getMe(@Ctx() { me }: Context): Promise<User | Error> {
    const user: User = (await User.findOne(
      { id: me.id },
      { relations: ["profile"] }
    )) as User;
    if (user) {
      console.log(user);

      return user;
    }
    throw new Error("Unable to retrieve user");
  }

  /**
   * Get all users username and email
   * @returns All users username and emails
   */
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const users: User[] = await User.find({
      select: ["username", "email"],
    });
    if (users?.length > 0) {
      return users;
    }
    throw new Error("No users were found");
  }

  /**
   * Create a new user
   * @param username User username
   * @param email User email
   * @param password  User pre-hashed password
   * @returns User and token
   */
  @Mutation(() => UserLogin)
  async createUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserLogin> {
    // Create new user and add to DB
    const user: User = await User.create({ username, email, password }).save();

    // Generate new token for the user
    const token: string = await createToken(user);
    return { token, user };
  }

  /**
   * Login user by either the username or email and validated password
   * @param login User selected username or email
   * @param password Unhashed password
   * @returns New token
   */
  @Mutation(() => UserLogin)
  async loginUser(
    @Arg("login") login: string,
    @Arg("password") password: string
  ): Promise<UserLogin> {
    // Attempt to find user by username
    let user: User = (await User.findOne(
      { username: login },
      { relations: ["profile"] }
    )) as User;
    // If no user found, attempt to find by email
    if (!user) {
      user = (await User.findOne(
        { email: login },
        { relations: ["profile"] }
      )) as User;
    }
    // No user found for username or email
    if (!user) {
      throw new Error("Invalid username or email");
    }

    // Validate password is correct
    const isValid: boolean = await user.validatePassword(password);
    if (!isValid) {
      throw new Error("Invalid password.");
    }

    // Create a new token for the authenticated user
    const token: string = await createToken(user);
    return { user, token };
  }

  /**
   * Create a link to reset users password.
   * @param email Email to send password reset link to
   * @returns
   */
  @Mutation(() => Boolean)
  async resetPassword(@Arg("email") email: string): Promise<Boolean | Error> {
    const emailService: EmailService = new EmailService();
    let passwordReset: PasswordReset = (await PasswordReset.findOne({
      where: {
        email,
      },
    })) as PasswordReset;

    // Remove existing reset link
    if (passwordReset) passwordReset.remove();

    // Create a new password entry
    passwordReset = await PasswordReset.create({ email }).save();
    if (!passwordReset) {
      return Error("Error creating password reset. Please try again.");
    }

    const user: User = (await User.findOne({ email })) as User;
    if (user) {
      // TODO: Uncomment after testing
      emailService.resetPassword(email, passwordReset.id);
    }
    return true;
  }

  /**
   * Change the user password
   * @param id Id of the password reset object
   * @param password User entered password to change to
   * @returns User and token for immediate login
   */
  @Mutation(() => UserLogin)
  async changePassword(
    @Arg("id") id: string,
    @Arg("password") password: string
  ): Promise<UserLogin | Error> {
    // Check if user has a password reset active
    let passwordReset: PasswordReset = (await PasswordReset.findOne({
      id,
    })) as PasswordReset;

    // Check if passwordReset object is valid and update password
    if (passwordReset) {
      const nowTime: number = new Date().getTime();
      const expiredTime: number =
        new Date(passwordReset.createdAt).getTime() + 60 * 60 * 24 * 1000;
      if (nowTime > expiredTime) {
        // Password is expired, send the user a new token
        const emailService: EmailService = new EmailService();
        passwordReset.remove();
        passwordReset = await PasswordReset.create({
          email: passwordReset.email,
        }).save();
        if (!passwordReset) {
          return Error("Error resetting password, please try again");
        }
        emailService.resetPassword(passwordReset.email, passwordReset.id);
        return Error("Password Link Expired, new link sent to email.");
      }

      // Get user and update password
      const user: User = (await User.findOne(
        { email: passwordReset.email },
        { relations: ["profile"] }
      )) as User;
      if (user) {
        user.password = password;
        user.save();
        // Create new token to return
        const token: string = await createToken(user);
        passwordReset.remove();
        return { user, token };
      }
    }
    throw new Error("Failed password reset");
  }

  @Query(() => String)
  async getResetToken(@Arg("id") id: string): Promise<String> {
    const passwordReset: PasswordReset = (await PasswordReset.findOne(
      id
    )) as PasswordReset;
    if (passwordReset) {
      const nowTime: number = new Date().getTime();
      const expiredTime: number =
        new Date(passwordReset.createdAt).getTime() + 60 * 60 * 24 * 1000;
      if (nowTime > expiredTime) {
        throw new Error("Reset link has expired, please submit a new one.");
      }
      return passwordReset.email;
    }
    throw new Error("Password reset not found, create a new recovery.");
  }

  /**
   * Easy check to ensure the server is working properly
   * @returns Hello
   */
  @Query(() => String)
  hello() {
    // const email = "deadstylebp@gmail.com";
    // const link = "http://waugze.com/about";
    // EmailService.sendEmail(link, email);

    return "Hello World!";
  }
}
