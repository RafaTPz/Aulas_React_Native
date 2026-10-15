import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'tasks.db';

let database: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database !== null) {
    return database;
  }

  // Compartilha também a inicialização, para nenhuma consulta preceder a migração.
  database = (async () => {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    try {
      await runMigrations(db);
      return db;
    } catch (error) {
      await db.closeAsync();
      throw error;
    }
  })().catch((error) => {
    database = null;
    throw error;
  });

  return database;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT    NOT NULL
    );
  `);
}
