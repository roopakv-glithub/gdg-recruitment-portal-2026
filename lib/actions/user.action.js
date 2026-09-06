// import User from "@lib/modals/user.modal";
// import { connect } from "@lib/db";
import User from "../modals/user.modal";
import { connect } from "../db";

export async function createUser(user) {
  try {
    await connect();
    const newUser = await User.create(user);
    console.log("New user created: ", newUser);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user");
  }
}
