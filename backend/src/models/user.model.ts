import { getDb } from "../config/db";
import bcrypt from "bcryptjs";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export async function createUser(user: User) {
  const db = await getDb();
  const hashedPassword = await bcrypt.hash(user.password, 10);
  await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
    user.name,
    user.email,
    hashedPassword,
  ]);
}

export async function findUserByEmail(email: string) {
  const db = await getDb();
  return db.get("SELECT * FROM users WHERE email = ?", [email]);
}

export async function findUserById(id: number) {
  const db = await getDb();
  return db.get("SELECT * FROM users WHERE id = ?", [id]);
}

export async function updateUser(userId: number, newName: string) {
  const db = await getDb();
  await db.run("UPDATE users SET name = ? WHERE id = ?", [newName, userId]);
}

export async function saveRefreshToken(userId: number, refreshToken: string) {
  const db = await getDb();
  await db.run("UPDATE users SET refresh_token = ? WHERE id = ?", [
    refreshToken,
    userId,
  ]);
}

export async function getUserByRefreshToken(refreshToken: string) {
  const db = await getDb();
  return db.get("SELECT * FROM users WHERE refresh_token = ?", [refreshToken]);
}

export async function removeRefreshToken(userId: number) {
  const db = await getDb();
  await db.run("UPDATE users SET refresh_token = NULL WHERE id = ?", [userId]);
}
