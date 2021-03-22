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
  const token = await jwt.sign({ id, email, username }, secret, {
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
  async getMe(@Ctx() { me }: Context): Promise<User | undefined> {
    const user: User | undefined = await User.findOne(
      { id: me.id },
      { relations: ["profile"] }
    );
    if (user) {
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
    let user: User | undefined = await User.findOne(
      { username: login },
      { relations: ["profile"] }
    );
    // If no user found, attempt to find by email
    if (!user) {
      user = await User.findOne({ email: login }, { relations: ["profile"] });
    }
    // No user found for username or email
    if (!user) {
      throw new Error("Invalid username or email");
    }

    // Validate password is correct
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new Error("Invalid password.");
    }

    // Create a new token for the authenticated user
    const token: string = await createToken(user);
    return { user, token };
  }

  /**
   * Easy check to ensure the server is working properly
   * @returns Hello
   */
  @Query(() => String)
  hello() {
    const email = "deadstylebp@gmail.com";
    const link = "http://waugze.com/about";
    EmailService.sendEmail(link, email);

    return "Hello World!";
  }
}
