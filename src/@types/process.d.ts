declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      readonly NODE_ENV: string;
      readonly PORT: number;
      readonly JWT_SECRET: string;
      readonly JWT_EXPIRES: string;

      readonly DB_HOST: string;
      readonly DB_PORT: number;
      readonly DB_USER: string;
      readonly DB_PWD: string;
      readonly DB_NAME: string;

      readonly KEY_TABLE_NAME: string;
      readonly SENTRY_DNS: string;
    }
  }
}

export {};
