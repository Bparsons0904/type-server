import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { Context, ProductInput } from "../helpers/types";
import { relative } from "node:path";

@Resolver()
export class ProductResolver {
  /**
   * Create a new user profile and associate to the user
   * @param createProfile Input of all fields for profile
   * @param me Authenticated user data
   * @returns Success or failure of profile creation
   */
  @Query(() => Product)
  async getProduct(@Arg("id") id: string): Promise<Product> {
    // Create a new Product
    const product: Product = (await Product.findOne({ id })) as Product;
    if (!product) throw new Error("Unable to find product.");

    return product;
  }

  /**
   * Create a new user profile and associate to the user
   * @param createProfile Input of all fields for profile
   * @param me Authenticated user data
   * @returns Success or failure of profile creation
   */
  @Query(() => [Product])
  async getProducts(@Ctx() { me }: Context): Promise<Product[]> {
    // Create a new Product

    const products: Product[] = await Product.find({
      relations: ["user"],
      where: { user: me.id },
    });
    if (!products) throw new Error("Unable to find any products.");

    return products;
  }

  /**
   * Create a new user profile and associate to the user
   * @param createProfile Input of all fields for profile
   * @param me Authenticated user data
   * @returns Success or failure of profile creation
   */
  @UseMiddleware(isAuth)
  @Mutation(() => [Product])
  async createProduct(
    @Arg("createProduct", () => ProductInput) createProduct: ProductInput,
    @Ctx() { me }: Context
  ): Promise<Product[]> {
    // Create a new Product
    const user: User = (await User.findOne({ id: me.id })) as User;
    if (!user) throw new Error("Unable to find user.");

    createProduct.user = user;
    const product: Product = await Product.create(createProduct).save();
    const products: Product[] = await Product.find({
      relations: ["user"],
      where: { user: me.id },
    });
    if (!product || !products)
      throw new Error("Unable to retrieve user or create profile");

    return products;
  }

  /**
   * Create a new user profile and associate to the user
   * @param createProfile Input of all fields for profile
   * @param me Authenticated user data
   * @returns Success or failure of profile creation
   */
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteProduct(
    @Arg("id") id: string,
    @Ctx() { me }: Context
  ): Promise<boolean> {
    console.log(id);

    // Delete a new Product
    const product: Product = (await Product.findOne({
      where: { id },
      relations: ["user"],
    })) as Product;
    console.log("Post product", product);

    if (!product) throw new Error("Unable to find product.");

    if (product.user.id !== me.id)
      throw new Error("User can not delete this product");

    try {
      await product.remove();
    } catch (error) {
      throw new Error("Error trying to remove product");
    }

    return true;
  }

  /**
   * Update the existing user profile
   * @param updateProfile All fields related to the profile model
   * @returns Success or failure of the update
   */
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async updateProfile(
    @Arg("updateProduct", () => ProductInput) updateProduct: ProductInput
  ): Promise<Boolean | Error> {
    // const profile: Profile | undefined = await Profile.findOne({
    //   id: updateProfile.id,
    // });

    // if (!profile) {
    //   throw new Error("Profile not found");
    // }

    // // Update profile
    // await Profile.update({ id: profile.id }, updateProfile).then((res) => {
    //   if (res.affected === 0) {
    //     throw new Error("Profile did not properly save");
    //   }
    // });

    return true;
  }

  // TODO Remove before deploy, for testing only
  @Query(() => [Product])
  profiles() {
    return Product.find();
  }
}
