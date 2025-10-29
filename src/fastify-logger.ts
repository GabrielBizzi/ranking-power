import * as Sentry from '@sentry/node';
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  hooks: {
    logMethod(args, method) {
      const [message, ...rest] = args;
      if (message && method.name === 'error') {
        Sentry.captureException(
          (message as any) instanceof Error ? message : new Error(message),
        );
      }
      method.apply(this, args);
    },
  },
});
