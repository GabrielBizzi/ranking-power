import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from '@fastify/helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fastifyCsrf from '@fastify/csrf-protection';
import { contentParser } from 'fastify-multer';
import 'reflect-metadata';
import compression from '@fastify/compress';
import { version } from '../package.json';
import * as Sentry from '@sentry/node';
import { SentryFilter } from './filters/sentry.filter';
import { AppModule } from '@/app.module';
import { AppUtils } from '@/common/utils/app.util';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { logger as fastifyLogger } from './fastify-logger';
import { UnauthorizedInterceptor } from './filters/interceptors/http-exceptions/unauthorized.interceptor';
import { BadRequestInterceptor } from './filters/interceptors/http-exceptions/bad-request.interceptor';
import { NotFoundInterceptor } from './filters/interceptors/http-exceptions/not-found.interceptor';
import { DataBaseInterceptor } from './filters/interceptors/http-exceptions/database.interceptor';
import { FastifyStaticOptions } from '@nestjs/platform-fastify/interfaces/external';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,

    new FastifyAdapter({
      logger: fastifyLogger,

      async csrfProtection(req, reply, _done) {
        return req.headers['csrf-token'];
      },
    }),
    { cors: true },
  );
  AppUtils.killAppWithGrace(app);
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    enabled: process.env.NODE_ENV === 'production',
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  await app.register(helmet);
  await app.register(contentParser);
  await app.register(compression, {
    global: true,
    threshold: 1,
    encodings: ['gzip', 'deflate'],
  });

  // eslint-disable-next-line @typescript-eslint/ban-types
  const staticOptions: FastifyStaticOptions & { preHandler?: Function } = {
    root: join(__dirname, '..', '../upload'),
    prefix: '/upload',
    redirect: false,
    index: false,
    preHandler: (request, reply, done) => {
      reply.header('Content-Type', 'application/octet-stream');
      done();
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await app.register(require('@fastify/static'), staticOptions);

  await app.register(fastifyCsrf, {
    sessionPlugin: '@fastify/secure-session',
    getToken: function (req: any) {
      return req.headers['csrf-token'];
    },
  });

  app.useGlobalInterceptors(new DataBaseInterceptor());
  app.useGlobalInterceptors(new BadRequestInterceptor());
  app.useGlobalInterceptors(new NotFoundInterceptor());
  app.useGlobalInterceptors(new UnauthorizedInterceptor());
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  const config = new DocumentBuilder()
    .setTitle('Kersef')
    .setDescription('Kersef RestAPI documentation and examples')
    .setVersion(version)
    .addTag('version', 'Version information for Kersef')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      url: '/swagger-json',
    },
  });

  await app.listen(process.env.PORT, '0.0.0.0', (err, address) => {
    if (err) {
      throw err;
    }
    console.log('listening on: ' + address);
  });
}
bootstrap();
