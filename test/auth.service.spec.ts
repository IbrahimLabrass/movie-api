import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../src/users/entities/user.entity';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 

  describe('login', () => {
    it('should return an access token', async () => {
      const mockUser = { id: 1, username: 'testuser' };
      const mockToken = 'mock-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { username: 'newuser', password: 'password', email: 'newuser@example.com' };
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.username = createUserDto.username;
      mockUser.password = await bcrypt.hash(createUserDto.password, 10);
      mockUser.email = createUserDto.email;

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as any);

      const result = await service.register(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });
});
