import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  const mockRepository = {
    find: jest.fn(() => []),
    findOne: jest.fn((id) => ({ id, title: 'Test Movie', description: 'Test Description' })),
    create: jest.fn((movie) => movie),
    save: jest.fn((movie) => movie),
    update: jest.fn((id, movie) => movie),
    delete: jest.fn((id) => ({ affected: 1 })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all movies', async () => {
    const movies = await service.findAll();
    expect(movies).toEqual([]);
  });

  it('should find a movie by id', async () => {
    const movie = await service.findOne(1);
    expect(movie).toHaveProperty('id', 1);
    expect(movie).toHaveProperty('title', 'Test Movie');
  });

  it('should create a movie', async () => {
    const newMovie = await service.create({ title: 'New Movie', description: 'New Description' });
    expect(newMovie).toHaveProperty('title', 'New Movie');
    expect(newMovie).toHaveProperty('description', 'New Description');
  });

  it('should update a movie', async () => {
    const updatedMovie = await service.update(1, { title: 'Updated Movie' });
    expect(updatedMovie).toHaveProperty('title', 'Updated Movie');
  });

  it('should delete a movie', async () => {
    const deleteResult = await service.remove(1);
    expect(deleteResult).toEqual({ affected: 1 });
  });

});
