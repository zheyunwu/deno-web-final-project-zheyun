import { executeQuery } from "../database/database.js"

const searchUser = async(email) => {
  const res = await executeQuery("SELECT * FROM users WHERE email = $1;", email);
  return res;
}

const addUser = async(email, password) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2);", email, password);
}

export { searchUser, addUser };