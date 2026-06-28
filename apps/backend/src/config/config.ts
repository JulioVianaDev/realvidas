import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

export const rootPath = path.resolve(__dirname, '../../../../');

const envFilePath = path.resolve(rootPath, '.env');

/** Raw `.env` parse — avoids `$` expansion that breaks ASAAS/OpenPix keys. */
let parsedEnvFile: Record<string, string> | null = null;

function getParsedEnvFile(): Record<string, string> {
  if (parsedEnvFile) {
    return parsedEnvFile;
  }
  if (!fs.existsSync(envFilePath)) {
    parsedEnvFile = {};
    return parsedEnvFile;
  }
  parsedEnvFile = dotenv.parse(fs.readFileSync(envFilePath));
  return parsedEnvFile;
}

// Load into process.env; override so corrupted/empty values get replaced.
dotenv.config({ path: envFilePath, override: true });

function env(key: string, defaultValue?: string): string | undefined {
  const fromProcess = process.env[key];
  if (fromProcess !== undefined && fromProcess !== '') {
    return fromProcess;
  }

  const fromFile = getParsedEnvFile()[key];
  if (fromFile !== undefined && fromFile !== '') {
    return fromFile;
  }

  return defaultValue;
}

function envInt(key: string, defaultValue: number): number {
  const value = env(key);
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}

function envPrefix(key: string, fallback: string): string {
  const trimmed = env(key)?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export const MAX_CONNECTION_POOL_SIZE = envInt(
  'MAX_CONNECTION_POOL_SIZE',
  10,
);

export function coercePgPassword(): string {
  const value = env('DB_PASSWORD') ?? env('POSTGRES_PASSWORD');
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
}

export function buildAppConfig() {
  const redisHost = env('REDIS_HOST', 'localhost')!;
  const redisPort = envInt('REDIS_PORT', 6379);
  const redisPassword = env('REDIS_PASSWORD');
  const rabbitUser = env('RABBITMQ_USER', 'guest');
  const rabbitPassword = env('RABBITMQ_PASSWORD', 'guest');
  const rabbitHost = env('RABBITMQ_HOST', 'localhost');
  const rabbitPort = env('RABBITMQ_PORT', '5672');
  const frontendUrl = env('FRONTEND_URL', 'http://localhost:5173')!;

  return {
    env: env('ENV', 'local')!,
    port: envInt('PORT', 3000),
    nestPort: envInt('NEST_PORT', 8080),
    baseUrl: env('API_URL'),
    rootPath,
    FRONTEND_URL: frontendUrl,
    JWT_SECRET: env('JWT_SECRET'),
    BCRYPT_SALT_ROUNDS: envInt('BCRYPT_SALT_ROUNDS', 10),
    GOOGLE_CLIENT_ID: env('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: env('GOOGLE_CLIENT_SECRET'),
    GOOGLE_REDIRECT_URI: env('GOOGLE_REDIRECT_URI', 'postmessage'),
    CREDIT_CONSUMER_ENABLED: env('CREDIT_CONSUMER_ENABLED', 'true'),
    SOCIAL_MIDIA_MEOW_BASE_URL: env('SOCIAL_MIDIA_MEOW_BASE_URL'),
    ELASTIC_SEARCH_URL: env(
      'ELASTIC_SEARCH_URL',
      'http://localhost:9200',
    ),
    NODE_APP_INSTANCE: env('NODE_APP_INSTANCE'),
    HOSTNAME: env('HOSTNAME'),
    PM2_INSTANCES: env('instances'),
    database: {
      host: env('DB_HOST', 'localhost'),
      port: envInt('DB_PORT', 5432),
      username:
        env('DB_USERNAME') ?? env('POSTGRES_USER', 'postgres'),
      password: coercePgPassword(),
      name: env('DB_NAME') ?? env('POSTGRES_DB', 'postgres'),
    },
    redis: {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      url: env('REDIS_URL', `redis://${redisHost}:${redisPort}`),
    },
    REDIS_HOST: redisHost,
    REDIS_PORT: redisPort,
    REDIS_PASSWORD: redisPassword,
    REDIS_URL: env('REDIS_URL', `redis://${redisHost}:${redisPort}`),
    rabbitmq: {
      user: rabbitUser,
      password: rabbitPassword,
      host: rabbitHost,
      port: rabbitPort,
      url:
        env('RABBITMQ_URL') ??
        `amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}:${rabbitPort}`,
      managementUrl: env(
        'RABBITMQ_MANAGEMENT_URL',
        'http://127.0.0.1:15672',
      ),
      managementVhost: env('RABBITMQ_MANAGEMENT_VHOST'),
      managementUsername:
        env('RABBITMQ_MANAGEMENT_USERNAME') ?? rabbitUser,
      managementPassword:
        env('RABBITMQ_MANAGEMENT_PASSWORD') ?? rabbitPassword,
    },
    smtp: {
      host: env('SMTP_HOST'),
      port: envInt('SMTP_PORT', 465),
      user: env('SMTP_USER'),
      password: env('SMTP_PASSWORD'),
      from: env('SMTP_FROM') ?? env('SMTP_USER'),
    },
    SMTP_HOST: env('SMTP_HOST'),
    SMTP_PORT: envInt('SMTP_PORT', 465),
    SMTP_USER: env('SMTP_USER'),
    SMTP_PASSWORD: env('SMTP_PASSWORD'),
    SMTP_FROM: env('SMTP_FROM') ?? env('SMTP_USER'),
    stripe: {
      secretKey: env('STRIPE_SECRET_KEY'),
      webhookSecret: env('STRIPE_WEBHOOK_SECRET'),
      publicKey: env('STRIPE_PUBLIC_KEY'),
    },
    STRIPE_SECRET_KEY: env('STRIPE_SECRET_KEY'),
    STRIPE_WEBHOOK_SECRET: env('STRIPE_WEBHOOK_SECRET'),
    asaas: {
      apiKey: env('ASAAS_API_KEY'),
      environment: env('ASAAS_ENVIRONMENT', 'sandbox') as
        | 'production'
        | 'sandbox',
      webhookAccessToken: env('ASAAS_WEBHOOK_ACCESS_TOKEN'),
    },
    ASAAS_API_KEY: env('ASAAS_API_KEY'),
    ASAAS_ENVIRONMENT: env('ASAAS_ENVIRONMENT', 'sandbox'),
    ASAAS_WEBHOOK_ACCESS_TOKEN: env('ASAAS_WEBHOOK_ACCESS_TOKEN'),
    openpix: {
      apiKey: env('OPENPIX_API_KEY'),
      webhookSecret: env('OPENPIX_WEBHOOK_SECRET'),
      webhookPublicKey: env('OPENPIX_WEBHOOK_PUBLIC_KEY'),
      mainPixKey: env('OPENPIX_MAIN_PIX_KEY'),
    },
    OPENPIX_API_KEY: env('OPENPIX_API_KEY'),
    OPENPIX_WEBHOOK_SECRET: env('OPENPIX_WEBHOOK_SECRET'),
    OPENPIX_WEBHOOK_PUBLIC_KEY: env('OPENPIX_WEBHOOK_PUBLIC_KEY'),
    OPENPIX_MAIN_PIX_KEY: env('OPENPIX_MAIN_PIX_KEY'),
    ai: {
      openaiApiKey: env('OPENAI_API_KEY'),
      anthropicApiKey: env('ANTHROPIC_API_KEY'),
      geminiApiKey: env('GEMINI_API_KEY'),
      deepseekApiKey: env('DEEPSEEK_API_KEY'),
      openrouterApiKey: env('OPENROUTER_API_KEY'),
    },
    webhook: {
      queuePrefix: envPrefix('WEBHOOK_QUEUE_PREFIX', 'webhooks'),
      rebalanceIntervalMs: envInt(
        'WEBHOOK_REBALANCE_INTERVAL_MS',
        5000,
      ),
      consumerMode: (
        env('WEBHOOK_CONSUMER_MODE', 'group') ?? 'group'
      ).toLowerCase(),
      workerIndex: envInt('WEBHOOK_WORKER_INDEX', -1),
      workerCount: envInt('WEBHOOK_WORKER_COUNT', -1),
      syncIntervalMs: envInt('WEBHOOK_SYNC_INTERVAL_MS', 60000),
      extraInstanceKeys: env('WEBHOOK_EXTRA_INSTANCE_KEYS', ''),
      maxGroupsPerWorker: envInt('WEBHOOK_MAX_GROUPS_PER_WORKER', 0),
    },
    lifecycle: {
      queuePrefix: envPrefix('LIFECYCLE_QUEUE_PREFIX', 'lifecycle'),
      rebalanceIntervalMs: envInt(
        'LIFECYCLE_REBALANCE_INTERVAL_MS',
        5000,
      ),
      maxGroupsPerWorker: envInt(
        'LIFECYCLE_MAX_GROUPS_PER_WORKER',
        0,
      ),
    },
    creditQueue: {
      prefix: envPrefix('CREDIT_QUEUE_PREFIX', 'credits'),
    },
    adminAnalytics: {
      rabbitEnabled: env('ADMIN_ANALYTICS_RABBIT_ENABLED') === 'true',
      rebalanceIntervalMs: envInt(
        'ADMIN_ANALYTICS_REBALANCE_INTERVAL_MS',
        5000,
      ),
      maxGroupsPerWorker: envInt(
        'ADMIN_ANALYTICS_MAX_GROUPS_PER_WORKER',
        0,
      ),
    },
    upload: {
      folderBase: '/apps/uploads',
    },
  };
}

export const configuration = () => buildAppConfig();

export function getRedisOptionsFromConfig(): {
  host: string;
  port: number;
  password?: string;
} {
  const config = buildAppConfig();
  return {
    host: config.redis.host,
    port: config.redis.port,
    ...(config.redis.password
      ? { password: config.redis.password }
      : {}),
  };
}
