import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(() => []),
            findOne: jest.fn((id) => ({ id, title: 'Test Movie', description: 'Test Description' })),
            create: jest.fn((movie) => ({ id: 1, ...movie })),
            update: jest.fn((id, movie) => ({ id, ...movie })),
            remove: jest.fn((id) => ({ affected: 1 })),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all movies', async () => {
    const movies = await controller.findAll();
    expect(movies).toEqual([]);
  });

  it('should find a movie by id', async () => {
    const movie = await controller.findOne(1);
    expect(movie).toHaveProperty('id', 1);
    expect(movie).toHaveProperty('title', 'Test Movie');
  });

  it('should create a movie', async () => {
    const newMovie = await controller.create({ title: 'New Movie', description: 'New Description' });
    expect(newMovie).toHaveProperty('id', 1);
    expect(newMovie).toHaveProperty('title', 'New Movie');
  });

  it('should update a movie', async () => {
    const updatedMovie = await controller.update(1, { title: 'Updated Movie' });
    expect(updatedMovie).toHaveProperty('id', 1);
    expect(updatedMovie).toHaveProperty('title', 'Updated Movie');
  });

  it('should delete a movie', async () => {
    const deleteResult = await controller.remove(1);
    expect(deleteResult).toEqual({ affected: 1 });
  });

});
