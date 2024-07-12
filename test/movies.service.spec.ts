import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from '../src/movies/movies.service';
import { Movie } from '../src/movies/entities/movie.entity';
import { CreateMovieDto } from '../src/movies/dto/create-movie.dto';
import { UpdateMovieDto } from '../src/movies/dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        description: 'Description of the new movie',
        director: 'Director Name',
        releaseDate: '2023-01-01',
      };
      const createdMovie = { id: 1, ...createMovieDto };
      jest.spyOn(repository, 'create').mockReturnValue(createdMovie as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdMovie as any);

      const result = await service.create(createMovieDto);
      expect(result).toEqual(createdMovie);
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Movie Title',
        description: 'Updated movie description',
        director: 'Updated Director',
        releaseDate: '2023-01-01',
      };
      const existingMovie = { id: 1, title: 'Original Title', description: 'Original description', director: 'Original Director', releaseDate: new Date('2023-01-01') };
      const updatedMovie = { ...existingMovie, ...updateMovieDto };
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(existingMovie as any);
      jest.spyOn(repository, 'update').mockResolvedValue(undefined); // Mocking the update method to return undefined (no need to return updated movie here)
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(updatedMovie as any); // Mocking the findOne to return updated movie
      
      const result = await service.update(1, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });
  });


  describe('findAll', () => {
    it('should return all movies', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1', description: 'Description 1', director: 'Director 1', releaseDate: new Date('2023-01-01') },
        { id: 2, title: 'Movie 2', description: 'Description 2', director: 'Director 2', releaseDate: new Date('2023-01-02') },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockMovies as any);

      const result = await service.findAll();
      expect(result).toEqual(mockMovies);
    });
  });

  describe('findOne', () => {
    it('should find a movie by id', async () => {
      const mockMovie = { id: 1, title: 'Movie 1', description: 'Description 1', director: 'Director 1', releaseDate: new Date('2023-01-01') };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockMovie as any);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
