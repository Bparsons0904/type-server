import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from "type-graphql";
import { Profile } from "../entities/Profile";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { Context, ProfileInput } from "../helpers/types";

@Resolver()
export class ProfileResolver {
  /**
   * Create a new user profile and associate to the user
   * @param createProfile Input of all fields for profile
   * @param me Authenticated user data
   * @returns Success or failure of profile creation
   */
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async createProfile(
    @Arg("createProfile", () => ProfileInput) createProfile: ProfileInput,
    @Ctx() { me }: Context
  ): Promise<User> {
    // Create a new profile
    const profile: Profile = await Profile.create(createProfile).save();
    // Query user based on authentication
    const user = await User.findOne({ id: me.id });
    // If user is found, create profile association
    if (user) {
      user.profile = profile;
      await User.save(user);
      return user;
    }
    throw new Error("Unable to retrieve user or create profile");
  }

  /**
   * Update the existing user profile
   * @param updateProfile All fields related to the profile model
   * @returns Success or failure of the update
   */
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async updateProfile(
    @Arg("updateProfile", () => ProfileInput) updateProfile: ProfileInput
  ): Promise<Boolean> {
    const profile: Profile | undefined = await Profile.findOne({
      id: updateProfile.id,
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Update profile
    await Profile.update({ id: profile.id }, updateProfile).then((res) => {
      if (res.affected === 0) {
        throw new Error("Profile did not properly save");
      }
    });
    return true;
  }
}
