import { camelCase } from 'typeorm/util/StringUtils';

// Usage: npm run db:generate:main  (or db:generate:tenant)
// ts-node -r dotenv/config src/infra/postgres-databases/generate-migrations.ts <env> <type>
// env: dev | test | prod   |   type: public (main DB) | tenanted (tenant schema)
// Creates a blank migration file with empty up() and down() for you to fill in.
if (process.argv.length < 4) {
  console.log('Usage: generate-migrations.ts <env> <type>');
  console.log('  env: dev | test | prod');
  console.log('  type: public (main DB) | tenanted (tenant schemas)');
  process.exit(1);
}

const environment = process.argv[2];
const type = process.argv[3];

if (!['dev', 'development', 'test', 'testing', 'prod', 'production'].includes(environment)) {
  console.log('Please choose env: dev, test, or prod');
  process.exit(1);
}
if (type !== 'public' && type !== 'tenanted') {
  console.log('Please choose type: public or tenanted');
  process.exit(1);
}

generateBlankMigration()
  .then((filePath) => {
    console.log('Blank migration created:', filePath);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function getBlankMigrationTemplate(migrationName: string): string {
  return `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${migrationName} implements MigrationInterface {
  name = '${migrationName}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add your up queries here, e.g.:
    // await queryRunner.query(\`CREATE TABLE "example" (...)\`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add your down queries here (reverse of up).
  }
}
`;
}

async function generateBlankMigration(): Promise<string> {
  const fs = require('fs');
  const path = require('path');
  const timestamp = new Date().getTime();
  const migrationName = `Migration${timestamp}`;
  const fileContent = getBlankMigrationTemplate(migrationName);

  const migrationsDir =
    type === 'public'
      ? path.join(__dirname, 'main', 'migrations')
      : path.join(__dirname, 'tenant', 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  const fileName = `${timestamp}-${camelCase('migration', true)}.ts`;
  const filePath = path.join(migrationsDir, fileName);
  fs.writeFileSync(filePath, fileContent);
  return filePath;
}
