import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    createComment: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateComment: jest.fn(),
    remove: jest.fn(),
    removeComment: jest.fn(),
    search: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    })
    .overrideGuard(AuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'testuser',
      };

      const expectedResult = {
        _id: '507f1f77bcf86cd799439011',
        ...createPostDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
      };

      mockPostsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createPostDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('createComment', () => {
    it('should create a comment for a post', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const createCommentDto: CreateCommentDto = {
        comment: 'Test Comment',
        username: 'testuser',
      };

      const expectedResult = {
        _id: postId,
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'postuser',
        comments: [
          {
            _id: '507f1f77bcf86cd799439012',
            comment: createCommentDto.comment,
            username: createCommentDto.username,
            createdAt: new Date(),
          },
        ],
      };

      mockPostsService.createComment.mockResolvedValue(expectedResult);

      const result = await controller.createComment(postId, createCommentDto);

      expect(result).toEqual(expectedResult);
      expect(service.createComment).toHaveBeenCalledWith(postId, createCommentDto);
      expect(service.createComment).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const expectedResult = [
        {
          _id: '507f1f77bcf86cd799439011',
          topic: 'Test Topic 1',
          content: 'Test Content 1',
          community: 'Test Community 1',
          username: 'testuser1',
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '507f1f77bcf86cd799439012',
          topic: 'Test Topic 2',
          content: 'Test Content 2',
          community: 'Test Community 2',
          username: 'testuser2',
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPostsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no posts exist', async () => {
      mockPostsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('search', () => {
    it('should return posts matching search query', async () => {
      const query = 'test';
      const expectedResult = [
        {
          _id: '507f1f77bcf86cd799439011',
          topic: 'Test Topic',
          content: 'Test Content',
          community: 'Test Community',
          username: 'testuser',
          comments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPostsService.search.mockResolvedValue(expectedResult);

      const result = await controller.search(query);

      expect(result).toEqual(expectedResult);
      expect(service.search).toHaveBeenCalledWith(query);
      expect(service.search).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no posts match search query', async () => {
      const query = 'nonexistent';
      mockPostsService.search.mockResolvedValue([]);

      const result = await controller.search(query);

      expect(result).toEqual([]);
      expect(service.search).toHaveBeenCalledWith(query);
      expect(service.search).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const id = '507f1f77bcf86cd799439011';
      const expectedResult = {
        _id: id,
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'testuser',
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPostsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null when post not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockPostsService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(id);

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updatePostDto: UpdatePostDto = {
        topic: 'Updated Topic',
        content: 'Updated Content',
      };

      const expectedResult = {
        _id: id,
        topic: updatePostDto.topic,
        content: updatePostDto.content,
        community: 'Test Community',
        username: 'testuser',
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPostsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updatePostDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updatePostDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateComment', () => {
    it('should update a comment', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';
      const updateCommentDto: UpdateCommentDto = {
        comment: 'Updated Comment',
      };

      const expectedResult = {
        _id: postId,
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'testuser',
        comments: [
          {
            _id: commentId,
            comment: updateCommentDto.comment,
            username: 'commentuser',
            createdAt: new Date(),
          },
        ],
      };

      mockPostsService.updateComment.mockResolvedValue(expectedResult);

      const result = await controller.updateComment(postId, commentId, updateCommentDto);

      expect(result).toEqual(expectedResult);
      expect(service.updateComment).toHaveBeenCalledWith(postId, commentId, updateCommentDto);
      expect(service.updateComment).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const id = '507f1f77bcf86cd799439011';
      const expectedResult = {
        _id: id,
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'testuser',
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPostsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should return null when post to remove not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      mockPostsService.remove.mockResolvedValue(null);

      const result = await controller.remove(id);

      expect(result).toBeNull();
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeComment', () => {
    it('should remove a comment from a post', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';

      const expectedResult = {
        _id: postId,
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'testuser',
        comments: [], // Comment removed
      };

      mockPostsService.removeComment.mockResolvedValue(expectedResult);

      const result = await controller.removeComment(postId, commentId);

      expect(result).toEqual(expectedResult);
      expect(service.removeComment).toHaveBeenCalledWith(postId, commentId);
      expect(service.removeComment).toHaveBeenCalledTimes(1);
    });
  });
});
