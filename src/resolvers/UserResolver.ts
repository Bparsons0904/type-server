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

  ////////////////////////////////////////////////////////
  // User Authentication
  ////////////////////////////////////////////////////////

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
      return user;
    }
    throw new Error("Unable to retrieve user");
  }

  /**
   * Create a new user
   * @param username User username
   * @param email User email
   * @param password  User pre-hashed password
   * @returns True if processes completed successfully
   */
  @Mutation(() => Boolean)
  async createUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("remember") remember: boolean
  ): Promise<boolean> {
    // Create new user and add to DB
    const user: User = await User.create({ username, email, password }).save();
    if (!user) {
      throw new Error("Error creating a new user");
    }

    const emailService: EmailService = new EmailService();
    const link: string = `${user.id}/${remember}`;
    emailService.registration(user.email, link);
    return true;
  }

  /**
   * Get user by id and confirm user registered
   * @param id Provided id of user
   * @returns User and token
   */
  @Mutation(() => UserLogin)
  async completeRegistration(@Arg("id") id: string): Promise<UserLogin> {
    // Create new user and add to DB
    const user: User = (await User.findOne({ id })) as User;
    if (!user) {
      throw new Error("Error finding user");
    }

    user.verified = true;
    await user.save();
    const token: string = await createToken(user);
    return { user, token };
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
    @Arg("password") password: string,
    @Arg("remember") remember: boolean
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

    // Resend the validation email to the user
    if (!user.verified) {
      const emailService: EmailService = new EmailService();
      const link: string = `${user.id}/${remember}`;
      emailService.registration(user.email, link);
      throw new Error("Email not validated.");
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

  ////////////////////////////////////////////////////////
  // Password Resets and Changes
  ////////////////////////////////////////////////////////

  /**
   *  Validate token before providing user emails
   * @param id Password reset id sent to the user
   * @returns Email of user to reset
   */
  @Query(() => String)
  async getResetToken(@Arg("id") id: string): Promise<String> {
    // Get and validate id is valid
    const passwordReset: PasswordReset = (await PasswordReset.findOne(
      id
    )) as PasswordReset;
    if (!passwordReset) {
      throw new Error("Password reset not found, create a new recovery.");
    }
    const nowTime: number = new Date().getTime();
    const expiredTime: number =
      new Date(passwordReset.createdAt).getTime() + 60 * 60 * 24 * 1000;
    // Verify request has not expired
    if (nowTime > expiredTime) {
      throw new Error("Reset link has expired, please submit a new one.");
    }
    // Valid request, return email to be used to reset
    return passwordReset.email;
  }

  /**
   * Create a link to reset users password.
   * @param email Email to send password reset link to
   * @returns success or failure of request
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

    // Validate user exist and send email
    const user: User = (await User.findOne({ email })) as User;
    if (user) {
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
  ): Promise<UserLogin> {
    // Check if user has a password reset active
    let passwordReset: PasswordReset = (await PasswordReset.findOne({
      id,
    })) as PasswordReset;

    // Check if passwordReset object is valid and update password
    if (!passwordReset) {
      throw new Error("Failed password reset");
    }
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
        throw new Error("Error resetting password, please try again");
      }
      emailService.resetPassword(passwordReset.email, passwordReset.id);
      throw new Error("Password Link Expired, new link sent to email.");
    }

    // Get user and update password
    const user: User = (await User.findOne(
      { email: passwordReset.email },
      { relations: ["profile"] }
    )) as User;
    if (!user) {
      throw new Error("Cannot find user");
    }
    user.password = password;
    user.save();
    // Create new token to return
    const token: string = await createToken(user);
    passwordReset.remove();
    return { user, token };
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
