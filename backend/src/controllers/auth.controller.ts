import {
  createUser,
  findUserByEmail,
  updateUser as updateUserModel,
  saveRefreshToken,
  removeRefreshToken,
  getUserByRefreshToken,
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
  const existingUser = await findUserByEmail(email);
  if (existingUser)
    throw new Error("Пользователь с таким email уже существует");
  await createUser({ name, email, password });
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw {
      statusCode: 404,
      message: "USER_NOT_FOUND",
      error: "Пользователь с таким email не найден",
    };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw {
      statusCode: 401,
      message: "INVALID_PASSWORD",
      error: "Неверный пароль",
    };
  }
  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
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

export const refresh = async (refreshToken: string) => {
  const user = await getUserByRefreshToken(refreshToken);
  if (!user) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  // Генерируем новый refresh token для ротации
  const newRefreshToken = generateRefreshToken();
  await saveRefreshToken(user.id, newRefreshToken);

  return { accessToken, refreshToken: newRefreshToken };
};
