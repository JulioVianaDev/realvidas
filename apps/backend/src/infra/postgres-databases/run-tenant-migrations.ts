/**
 * Run tenant migrations for a given schema.
 * Usage: npm run db:run:tenant -- tenant_1
 */
import 'dotenv/config';
import { runTenantMigrationsInSchema } from './tenant/tenant-migrations.runner';

async function runTenantMigrations() {
  const schema = process.argv[2];
  if (!schema) {
    console.error('Usage: run-tenant-migrations.ts <schema>');
    console.error('Example: npm run db:run:tenant -- tenant_1');
    process.exit(1);
  }

  const executed = await runTenantMigrationsInSchema(schema);
  if (executed.length === 0) {
    console.log(
      `Tenant schema "${schema}": no pending migrations (already up to date).`,
    );
  } else {
    console.log(
      `Tenant schema "${schema}": ran`,
      executed.length,
      'migration(s):',
      executed.map((m) => m.name),
    );
  }
}

runTenantMigrations().catch((err) => {
  console.error('Tenant migration failed:', err);
  process.exit(1);
});
