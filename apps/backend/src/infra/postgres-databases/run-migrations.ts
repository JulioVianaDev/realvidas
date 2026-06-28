/**
 * Run migrations for the main database.
 * Usage: npx ts-node -r tsconfig-paths/register src/postgres-databases/run-migrations.ts
 * Or after build: node dist/postgres-databases/run-migrations.js
 *
 * Loads .env from repo root (agenda-ai/.env).
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '../../../../../.env') });

import { DataSource, DataSourceOptions } from 'typeorm';
import { mainConfig } from './main/main.config.orm';

async function runMainMigrations() {
  const dataSource = new DataSource(mainConfig as DataSourceOptions);
  await dataSource.initialize();
  try {
    const executed = await dataSource.runMigrations();
    console.log('Main DB: ran', executed.length, 'migration(s):', executed.map((m) => m.name));
  } finally {
    await dataSource.destroy();
  }
}

runMainMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
