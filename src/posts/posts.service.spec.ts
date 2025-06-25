import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Posts } from './schemas/posts.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('PostsService', () => {
  let service: PostsService;
  let model: Model<Posts>;

  const mockPost = {
    _id: '507f1f77bcf86cd799439011',
    topic: 'Test Topic',
    content: 'Test Content',
    community: 'Test Community',
    username: 'testuser',
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  const mockComment = {
    _id: '507f1f77bcf86cd799439012',
    comment: 'Test Comment',
    username: 'commentuser',
    createdAt: new Date(),
  };

  const mockPostsModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    exec: jest.fn(),
    sort: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getModelToken(Posts.name),
          useValue: mockPostsModel,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    model = module.get<Model<Posts>>(getModelToken(Posts.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        topic: 'Test Topic',
        content: 'Test Content',
        community: 'Test Community',
        username: 'testuser',
      };

      const mockSave = jest.fn().mockResolvedValue({
        ...createPostDto,
        _id: '507f1f77bcf86cd799439011',
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const mockPostInstance = {
        ...createPostDto,
        save: mockSave,
      };

      // Mock the model constructor by replacing the service's model
      Object.defineProperty(service, 'postsModel', {
        value: jest.fn().mockImplementation(() => mockPostInstance),
        writable: true,
      });

      const result = await service.create(createPostDto);

      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('createComment', () => {
    it('should add a comment to a post', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const createCommentDto: CreateCommentDto = {
        comment: 'Test Comment',
        username: 'commentuser',
      };

      const postWithComment = {
        ...mockPost,
        comments: [],
        save: jest.fn().mockResolvedValue({
          ...mockPost,
          comments: [mockComment],
        }),
      };

      mockPostsModel.findById.mockResolvedValue(postWithComment);

      const result = await service.createComment(postId, createCommentDto);

      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
      expect(postWithComment.save).toHaveBeenCalled();
      expect(postWithComment.comments).toHaveLength(1);
    });

    it('should throw NotFoundException when post not found', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const createCommentDto: CreateCommentDto = {
        comment: 'Test Comment',
        username: 'commentuser',
      };

      mockPostsModel.findById.mockResolvedValue(null);

      await expect(service.createComment(postId, createCommentDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('findAll', () => {
    it('should return all posts sorted by updatedAt', async () => {
      const posts = [mockPost];
      const sortMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(posts),
      });
      mockPostsModel.find.mockReturnValue({
        sort: sortMock,
      });

      const result = await service.findAll();

      expect(mockPostsModel.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      mockPostsModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPost),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(mockPostsModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        topic: 'Updated Topic',
        content: 'Updated Content',
      };

      const updatedPost = { ...mockPost, ...updatePostDto };
      mockPostsModel.findOneAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedPost),
      });

      const result = await service.update('507f1f77bcf86cd799439011', updatePostDto);

      expect(mockPostsModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: '507f1f77bcf86cd799439011' },
        updatePostDto,
      );
      expect(result).toEqual(updatedPost);
    });
  });

  describe('updateComment', () => {
    it('should update a comment in a post', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';
      const updateCommentDto: UpdateCommentDto = {
        comment: 'Updated Comment',
      };

      const comment = {
        _id: { toString: () => commentId },
        comment: 'Original Comment',
        username: 'commentuser',
        createdAt: new Date(),
      };

      const postWithComment = {
        ...mockPost,
        comments: [comment],
        save: jest.fn().mockResolvedValue({
          ...mockPost,
          comments: [{ ...comment, ...updateCommentDto }],
        }),
      };

      mockPostsModel.findById.mockResolvedValue(postWithComment);

      // Mock Object.assign to spy on it
      const assignSpy = jest.spyOn(Object, 'assign');

      const result = await service.updateComment(postId, commentId, updateCommentDto);

      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
      expect(postWithComment.save).toHaveBeenCalled();
      expect(assignSpy).toHaveBeenCalledWith(comment, updateCommentDto);
      
      assignSpy.mockRestore();
    });

    it('should throw NotFoundException when post not found', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';
      const updateCommentDto: UpdateCommentDto = {
        comment: 'Updated Comment',
      };

      mockPostsModel.findById.mockResolvedValue(null);

      await expect(
        service.updateComment(postId, commentId, updateCommentDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
    });

    it('should throw NotFoundException when comment not found', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';
      const updateCommentDto: UpdateCommentDto = {
        comment: 'Updated Comment',
      };

      const postWithoutComment = {
        ...mockPost,
        comments: [],
      };

      mockPostsModel.findById.mockResolvedValue(postWithoutComment);

      await expect(
        service.updateComment(postId, commentId, updateCommentDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      mockPostsModel.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPost),
      });

      const result = await service.remove('507f1f77bcf86cd799439011');

      expect(mockPostsModel.findOneAndDelete).toHaveBeenCalledWith({
        _id: '507f1f77bcf86cd799439011',
      });
      expect(result).toEqual(mockPost);
    });
  });

  describe('removeComment', () => {
    it('should remove a comment from a post', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';

      const comment = {
        _id: { toString: () => commentId },
        comment: 'Test Comment',
        username: 'commentuser',
        createdAt: new Date(),
      };

      const postWithComment = {
        ...mockPost,
        comments: [comment],
        save: jest.fn().mockResolvedValue({
          ...mockPost,
          comments: [],
        }),
      };

      mockPostsModel.findById.mockResolvedValue(postWithComment);

      const result = await service.removeComment(postId, commentId);

      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
      expect(postWithComment.save).toHaveBeenCalled();
      expect(postWithComment.comments).toEqual([]);
    });

    it('should throw NotFoundException when post not found', async () => {
      const postId = '507f1f77bcf86cd799439011';
      const commentId = '507f1f77bcf86cd799439012';

      mockPostsModel.findById.mockResolvedValue(null);

      await expect(service.removeComment(postId, commentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPostsModel.findById).toHaveBeenCalledWith(postId);
    });
  });

  describe('search', () => {
    it('should search posts by query', async () => {
      const query = 'test';
      const searchResults = [mockPost];

      const sortMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(searchResults),
      });

      mockPostsModel.find.mockReturnValue({
        sort: sortMock,
      });

      const result = await service.search(query);

      expect(mockPostsModel.find).toHaveBeenCalledWith({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { topic: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { community: { $regex: query, $options: 'i' } },
        ],
      });
      expect(sortMock).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(result).toEqual(searchResults);
    });

    it('should search with empty query when query is "Community"', async () => {
      const query = 'Community';
      const searchResults = [mockPost];

      const sortMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(searchResults),
      });

      mockPostsModel.find.mockReturnValue({
        sort: sortMock,
      });

      const result = await service.search(query);

      expect(mockPostsModel.find).toHaveBeenCalledWith({
        $or: [
          { username: { $regex: '', $options: 'i' } },
          { topic: { $regex: '', $options: 'i' } },
          { content: { $regex: '', $options: 'i' } },
          { community: { $regex: '', $options: 'i' } },
        ],
      });
      expect(result).toEqual(searchResults);
    });
  });
});
