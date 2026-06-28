import { DataSource, DataSourceOptions } from 'typeorm';

import { tenantConfig } from './tenant.config.orm';

const MAX_CONNECTION_POOL_SIZE = 5;

export const tenantConnections: {
  [schemaName: string]: DataSource;
} = {};

export async function getTenantConnection(
  tenantId: string,
): Promise<DataSource> {
  const connectionName = `tenant_${tenantId}`;

  if (tenantConnections[connectionName]) {
    const connection = tenantConnections[connectionName];
    return connection;
  } else {
    const dataSource = new DataSource({
      ...tenantConfig,
      name: connectionName,
      schema: connectionName,
      poolSize: MAX_CONNECTION_POOL_SIZE,
      // Every pooled connection must use the tenant schema — a one-time SET on
      // initialize only affects the first checkout; raw SQL subqueries then fail
      // with "relation … does not exist" when they resolve against public.
      extra: {
        options: `-c search_path=${connectionName},public`,
      },
    } as DataSourceOptions);

    await dataSource.initialize();

    tenantConnections[connectionName] = dataSource;

    return dataSource;
  }
}
