import {
  createUser,
  findUserByEmail,
  updateUser as updateUserModel,
  saveRefreshToken,
  removeRefreshToken,
} from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

function generateRefreshToken() {
  return crypto.randomBytes(40).toString("hex");
}

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  await createUser({ name, email, password });
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15s",
  });
  const refreshToken = generateRefreshToken();
  await saveRefreshToken(user.id, refreshToken);
  return { accessToken, refreshToken };
};

export const updateUser = async (userId: number, newName: string) => {
  await updateUserModel(userId, newName);
};

export const logout = async (userId: number) => {
  await removeRefreshToken(userId);
};
