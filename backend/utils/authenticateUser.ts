import User from '../models/User';

async function authenticateUser(token: string) {
  try {
    const user = await User.findOne({ token: token });
    return user ? user : null;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

export default authenticateUser;