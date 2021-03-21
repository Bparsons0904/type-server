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
// import { Profile } from "../entity/Profile";
import jwt from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth";
import { isAdmin } from "../middleware/isAdmin";
import { Context } from "../types";

/**
 * Create jwt token for user auth
 * @param user Current user
 * @param secret JWT Secret string
 * @param expiresIn Time until token expires
 * @returns Token as a string
 */
const createToken = async (user: User, secret: string, expiresIn: string) => {
  // Get values from the user
  const { id, email, username }: User = user;
  // Create signed token
  return await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
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
      console.log(user);

      // const profile: Profile = user.profile;
      return user;
    }
    throw new Error("Unable to retrieve user");
  }

  // TODO Remove
  @Query(() => [User])
  getUsers() {
    return User.find();
  }

  /**
   * Create a new user
   * @param username User username
   * @param email User email
   * @param password  User prehashed password
   * @returns User and token
   */
  @UseMiddleware(isAdmin)
  @Mutation(() => String)
  async createUser(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<string> {
    // Create new user and add to DB
    const user: User = await User.create({ username, email, password }).save();

    // Generate new token for the user
    const secret: string = process.env.SECRET ?? "";
    const token: string = await createToken(user, secret, "30 days");
    return token;
  }

  /**
   * Login user by either the username or email and validated password
   * @param login User selected username or email
   * @param password Unhashed password
   * @returns New token
   */
  @UseMiddleware(isAdmin)
  @Mutation(() => String)
  async loginUser(
    @Arg("login") login: string,
    @Arg("password") password: string
  ): Promise<String> {
    // Attempt to find user by username
    let loginUser: User | undefined = await User.findOne({ username: login });
    // If no user found, attempt to find by email
    if (!loginUser) {
      loginUser = await User.findOne({ email: login });
    }
    // No user found for username or email
    if (!loginUser) {
      throw new Error("Invalid username or email");
    }

    // Validate password is correct
    const isValid = await loginUser.validatePassword(password);
    if (!isValid) {
      throw new Error("Invalid password.");
    }

    // Create a new token for the authenticated user
    const secret: string = process.env.SECRET ?? "";
    const token: string = await createToken(loginUser, secret, "30 days");
    return token;
  }

  /**
   * Easy check to ensure the server is working properly
   * @returns Hello
   */
  @Query(() => String)
  hello() {
    return "hi!";
  }
}
