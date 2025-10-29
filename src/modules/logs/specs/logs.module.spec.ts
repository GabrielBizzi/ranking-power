import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../app.module';

jest.setTimeout(20000);

describe('LogsModule (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/logs/ (GET) - should return logs successfully', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'blitzcorvinato@gmail.com',
        password: '@Lajbargf01',
      })
      .expect(HttpStatus.OK);

    authToken = loginResponse.body.access_token;
    await request(app.getHttpServer())
      .get('/logs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);
  });
});
