import { User, UserBuilder } from "../models/User";
import { UserRepository } from "../models/UserRepository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(name: string, email: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const user = new UserBuilder()
        .withName(name)
        .withEmail(email)
        .build();

      return await this.userRepository.save(user);
    } catch (error) {
      console.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      console.error(`Error finding user by email: ${error}`);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error(`Error getting all users: ${error}`);
      throw error;
    }
  }
}