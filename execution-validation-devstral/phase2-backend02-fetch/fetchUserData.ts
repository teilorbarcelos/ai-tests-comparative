interface User {
  id: string;
  name: string;
  email: string;
}

class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

async function fetchUserData(userId: string): Promise<User> {
  const timeout = 5000;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);
  });

  try {
    const response = await Promise.race([
      fetch(`https://api.example.com/users/${userId}`),
      timeoutPromise,
    ]);

    if (!response.ok) {
      throw new UserNotFoundError(
        `User not found or server error: ${response.status}`
      );
    }

    const userData = await response.json();
    return {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      throw error;
    }
    throw new Error(`Failed to fetch user data: ${(error as Error).message}`);
  }
}

export { fetchUserData, UserNotFoundError, User };