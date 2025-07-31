"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.initDb = initDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
// Подключение к базе данных
function getDb() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, sqlite_1.open)({
            filename: path_1.default.resolve(__dirname, "../../database.db"),
            driver: sqlite3_1.default.Database,
        });
    });
}
// Инициализация таблиц
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield getDb();
        yield db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      refresh_token TEXT
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      status TEXT CHECK(status IN ('В работе', 'Готово', 'Просрочено')) DEFAULT 'В работе',
      deadline TEXT,
      image TEXT,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
    });
}
