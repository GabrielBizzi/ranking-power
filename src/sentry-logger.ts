import { Logger, Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryLogger extends Logger {
  error(message: string | Error, trace?: string, context?: string) {
    super.error(message, trace, context);

    Sentry.withScope(scope => {
      if (message instanceof Error) {
        Sentry.captureException(message);
      } else {
        Sentry.captureException(new Error(message));
      }

      if (context) {
        scope.setTag('context', context);
      }
      if (trace) {
        scope.setExtra('trace', trace);
      }
      scope.setLevel('error');
    });
  }

  warn(message: string, context?: string) {
    super.warn(message, context);

    Sentry.withScope(scope => {
      scope.setLevel('warning');
      if (context) {
        scope.setTag('context', context);
      }
      Sentry.captureMessage(message);
    });
  }

  debug(message: string, context?: string) {
    super.debug(message, context);

    Sentry.withScope(scope => {
      scope.setLevel('debug');
      if (context) {
        scope.setTag('context', context);
      }
      Sentry.captureMessage(message);
    });
  }

  verbose(message: string, context?: string) {
    super.verbose(message, context);

    Sentry.withScope(scope => {
      scope.setLevel('info');
      if (context) {
        scope.setTag('context', context);
      }
      Sentry.captureMessage(message);
    });
  }
}
