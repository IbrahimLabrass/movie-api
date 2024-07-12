import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { UsersService } from '../src/users/users.service';
import { Repository } from 'typeorm';


describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUsername', () => {
    it('should return a user', async () => {
      const user = { id: 1, username: 'test', password: 'test', email: 'test@test.com' };
      
      jest.spyOn(repo, 'findOne').mockResolvedValue(user as any);

      const result = await service.findOneByUsername('test');
      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto = { username: 'test', password: 'test', email: 'test@test.com' };
      const createdUser = { id: 1, ...createUserDto };

      jest.spyOn(repo, 'create').mockReturnValue(createdUser as any);
      jest.spyOn(repo, 'save').mockResolvedValue(createdUser as any);

      const result = await service.create(createUserDto as any);
      expect(result).toEqual(createdUser);
    });
  });
});
