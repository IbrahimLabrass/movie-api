import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(() => 'mock-token'),
            register: jest.fn(() => ({ id: 1, username: 'testuser' })),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a JWT token on login', async () => {
    const token = await controller.login({ username: 'testuser', password: 'password123' });
    expect(token).toHaveProperty('access_token');
  });

  it('should register a new user', async () => {
    const user = await controller.register({ username: 'newuser', password: 'newpassword' });
    expect(user).toHaveProperty('id');
  });

});
