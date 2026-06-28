import { DataSource, DataSourceOptions } from 'typeorm';
import { tenantConfig } from './tenant.config.orm';

/**
 * Run pending TypeORM tenant migrations inside a single schema (e.g. tenant_template, tenant_<uuid>).
 */
export async function runTenantMigrationsInSchema(
  schema: string,
): Promise<{ name: string }[]> {
  const dataSource = new DataSource({
    ...tenantConfig,
    schema,
  } as DataSourceOptions);

  await dataSource.initialize();
  try {
    // Include `public` so `uuid_generate_v4()` (uuid-ossp) and other DB-wide helpers resolve,
    // same as {@link getTenantConnection}.
    await dataSource.query(`SET search_path TO "${schema}", public`);
    const executed = await dataSource.runMigrations();
    return executed.map((m) => ({ name: m.name }));
  } finally {
    await dataSource.destroy();
  }
}
