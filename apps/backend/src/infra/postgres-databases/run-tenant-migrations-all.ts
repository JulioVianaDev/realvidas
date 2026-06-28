/**
 * Run tenant migrations for `tenant_template` first, then every `tenant_<uuid>` from public.tenants.
 *
 * Usage: npm run db:run:tenant:all
 */
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { mainConfig } from './main/main.config.orm';
import { runTenantMigrationsInSchema } from './tenant/tenant-migrations.runner';
import { TENANT_TEMPLATE_SCHEMA } from './tenant/tenant-template.constants';

async function runForAllTenants() {
  const mainDs = new DataSource(mainConfig as DataSourceOptions);
  try {
    await mainDs.initialize();
  } catch (err) {
    console.error(
      '\nCould not connect to PostgreSQL. Check DB_HOST, DB_USERNAME, DB_PASSWORD (or POSTGRES_PASSWORD), DB_NAME.',
      '\n.env files are merged from: cwd, apps/backend/.env, and repo root (see load-postgres-env.ts).\n',
    );
    throw err;
  }

  let tenantIds: string[] = [];
  let templateExists = false;
  try {
    const templateRows = await mainDs.query(
      `SELECT schema_name FROM information_schema.schemata WHERE schema_name = $1`,
      [TENANT_TEMPLATE_SCHEMA],
    );
    templateExists = templateRows.length > 0;

    const rows = await mainDs.query(
      'SELECT id FROM public.tenants ORDER BY id',
    );
    tenantIds = rows.map((r: { id: string }) => r.id);
  } catch (err: unknown) {
    const code =
      err &&
      typeof err === 'object' &&
      'driverError' in err &&
      err.driverError &&
      typeof err.driverError === 'object' &&
      'code' in err.driverError
        ? (err.driverError as { code?: string }).code
        : err &&
            typeof err === 'object' &&
            'code' in err &&
            typeof (err as { code?: string }).code === 'string'
          ? (err as { code: string }).code
          : undefined;
    if (code === '42P01') {
      console.error(
        'Table public.tenants not found. Run main migrations first: npm run db:run:main',
      );
      process.exit(1);
    }
    throw err;
  } finally {
    await mainDs.destroy();
  }

  if (templateExists) {
    console.log(`[1/2] Template schema "${TENANT_TEMPLATE_SCHEMA}"...`);
    const executed = await runTenantMigrationsInSchema(
      TENANT_TEMPLATE_SCHEMA,
    );
    if (executed.length === 0) {
      console.log(`  already up to date`);
    } else {
      console.log(
        `  ran ${executed.length} migration(s):`,
        executed.map((m) => m.name),
      );
    }
  } else {
    console.log(
      `Schema "${TENANT_TEMPLATE_SCHEMA}" not found — create it with seed (npm run seed / tools). Skipping template.`,
    );
  }

  if (tenantIds.length === 0) {
    console.log(
      'No rows in public.tenants. Nothing else to migrate.',
    );
    console.log('Done.');
    return;
  }

  console.log(
    `[2/2] ${tenantIds.length} tenant schema(s): tenant_${tenantIds.join(', tenant_')}...`,
  );

  for (const id of tenantIds) {
    const schema = `tenant_${id}`;
    const executed = await runTenantMigrationsInSchema(schema);
    if (executed.length === 0) {
      console.log(`  ${schema}: already up to date`);
    } else {
      console.log(
        `  ${schema}: ran ${executed.length} migration(s):`,
        executed.map((m) => m.name),
      );
    }
  }

  console.log('Done.');
}

runForAllTenants().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
