import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    // clean all data after integration tests
    await app.get<Connection>(getConnectionToken()).db.dropDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return token, give correct password and username', async () => {
      const user = {
        userId: '11111111-1111-1111-1111-111111111112',
        username: 'User12',
        password:
          '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
      };

      const login = {
        userId: '11111111-1111-1111-1111-111111111112',
        isLocked: false,
        lockedAt: null,
        invalidLoginTimestamps: [],
      };

      await app
        .get<Connection>(getConnectionToken())
        .db.collection('users')
        .insertOne(user);

      await app
        .get<Connection>(getConnectionToken())
        .db.collection('login')
        .insertOne(login);

      const data = {
        username: 'User12',
        password: 'Password-11',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(data);
      expect(response.statusCode).toBe(201);
    });

    it('should lock the account after three consecutive failed login attempts', async () => {
      const user = {
        userId: '11111111-1111-1111-1111-111111111113',
        username: 'User13',
        password:
          '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
      };

      const login = {
        userId: '11111111-1111-1111-1111-111111111113',
        isLocked: false,
        lockedAt: null,
        invalidLoginTimestamps: [],
      };

      await app
        .get<Connection>(getConnectionToken())
        .db.collection('users')
        .insertOne(user);

      await app
        .get<Connection>(getConnectionToken())
        .db.collection('login')
        .insertOne(login);

      // Perform three consecutive failed login attempts
      for (let i = 0; i < 3; i++) {
        const data = {
          username: 'User13',
          password: 'Wrong-Password',
        };
        await request(app.getHttpServer()).post('/auth/login').send(data);
      }

      // The account should now be locked
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'User13', password: 'Wrong-Password' });

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({
        statusCode: 403,
        message: 'User is locked',
        error: 'Forbidden',
      });
    });

    it('should not lock the account and return 401, given invalid credentials', async () => {
      const user = {
        userId: '11111111-1111-1111-1111-111111111114',
        username: 'User14',
        password:
          '$2b$10$PlMgwKvTFP2QDgWDaa/rO.3yPFVVotvN2HGPq9kXPKSBNwjn2dxXG',
      };

      const login = {
        userId: '11111111-1111-1111-1111-111111111114',
        isLocked: false,
        lockedAt: null,
        invalidLoginTimestamps: [
          new Date(Date.now() - 6 * 60 * 1000), // Timestamp from 4 minutes ago
          new Date(Date.now() - 4 * 60 * 1000), // Timestamp from 4 minutes ago
        ],
      };

      await app
        .get<Connection>(getConnectionToken())
        .db.collection('users')
        .insertOne(user);

      await app
        .get<Connection>(getConnectionToken())
        .db.collection('login')
        .insertOne(login);

      // Perform a login attempt
      const data = {
        username: 'User14',
        password: 'Wrong-Password',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(data);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({
        statusCode: 401,
        message: 'Invalid Password',
        error: 'Unauthorized',
      });
    });

    it('should return 400 for invalid username format', async () => {
      const data = {
        username: 'user1',
        password: 'valid-Password',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(data);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'Must contain at least one uppercase letter, one lowercase letter, and ' +
            'only use letters and numbers. Length must be between 5 and 32 characters.',
        ],
        error: 'Bad Request',
      });
    });

    it('should return 400 for invalid password format', async () => {
      const data = {
        username: 'ValidUsername',
        password: 'invalidPassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(data);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: [
          'Must contain at least one uppercase letter, one lowercase letter, and ' +
            'one of the characters (_,-,+). Only use letters, numbers, and the specified ' +
            'characters. Length must be between 8 and 32 characters.',
        ],
        error: 'Bad Request',
      });
    });
  });
});
