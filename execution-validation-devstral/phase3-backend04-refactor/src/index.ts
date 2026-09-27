import { UserService } from "./services/UserService";
import { InMemoryUserRepository } from "./models/UserRepository";

const userRepository = new InMemoryUserRepository();
const userService = new UserService(userRepository);

(async () => {
  try {
    const user1 = await userService.createUser("John Doe", "john@example.com");
    console.log("Created user:", user1);

    const user2 = await userService.getUserByEmail("john@example.com");
    console.log("Found user:", user2);

    const allUsers = await userService.getAllUsers();
    console.log("All users:", allUsers);
  } catch (error) {
    console.error("Error:", (error as Error).message);
  }
})();