import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/login should authenticate a valid user', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'john@doe.com', password: 'johndoe123' })
      .expect(201)
      .expect((res) => {
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('john@doe.com');
      });
  });

  it('POST /api/auth/login should reject invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'john@doe.com', password: 'wrong' })
      .expect(401);
  });

  it('GET /api/auth/me should require auth', () => {
    return request(app.getHttpServer())
      .get('/api/auth/me')
      .expect(401);
  });
});
