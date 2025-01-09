import Auth from "../Model/AuthModel";

export const blockUser = async (id: string) => {
  try {
    // Find the user by their ID
    const user = await Auth.findById(id);

    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Update the 'active' field to false
    user.active = false;

    // Save the updated user document
    await user.save();

    return { message: "User blocked successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
};
