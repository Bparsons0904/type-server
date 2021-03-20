import {
  Resolver,
  Mutation,
  Arg,
  Query,
  InputType,
  Field,
  Float,
  Ctx,
  // ObjectType,
} from "type-graphql";
import { Profile } from "../entity/Profile";
import { User } from "../entity/User";

@InputType()
class ProfileInput {
  @Field({ nullable: true })
  id?: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  email: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  image?: string;
  @Field({ nullable: true })
  role?: string;
  @Field(() => Float, { nullable: true })
  phone?: number;
}

// TODO Move to shared file
interface Context {
  req: Request;
  res: Response;
  me: User;
  token: string;
}

@Resolver()
export class ProfileResolver {
  /**
   * Create a new user profile and associate to the user
   * @param createProfile Input of all fields for profile
   * @param me Authenticated user data
   * @returns Success or failure of profile creation
   */
  @Mutation(() => Boolean)
  async createProfile(
    @Arg("createProfile", () => ProfileInput) createProfile: ProfileInput,
    @Ctx() { me }: Context
  ): Promise<Boolean> {
    // Create a new profile
    const profile: Profile = await Profile.create(createProfile).save();
    // Query user based on authentication
    const user = await User.findOne({ id: me.id });
    // If user is found, create profile association
    if (user) {
      user.profile = profile;
      await User.save(user);
      return true;
    }
    throw new Error("Unable to retrieve user or create profile");
  }

  /**
   * Update the existing user profile
   * @param updateProfile All fields related to the profile model
   * @returns Success or failure of the update
   */
  @Mutation(() => Boolean)
  async updateProfile(
    @Arg("updateProfile", () => ProfileInput) updateProfile: ProfileInput
  ): Promise<Boolean | Error> {
    const profile: Profile | undefined = await Profile.findOne({
      id: updateProfile.id,
    });
    if (!profile) {
      return Error("Profile not found");
    }
    // TODO Validate the update was successful
    await Profile.update({ id: profile.id }, updateProfile);
    return true;
  }

  // TODO Remove before deploy, for testing only
  @Query(() => [Profile])
  profiles() {
    return Profile.find();
  }
}
