import { userRepository } from "../repositories/user.repository";

export const userService = {
  async list() {
    return userRepository.findMany();
  },

  async getById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
};
