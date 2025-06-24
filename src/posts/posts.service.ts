import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Posts, PostsDocument } from './schemas/posts.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postsModel: Model<PostsDocument>) {}

  create(createPostDto: CreatePostDto) {
    const post = new this.postsModel(createPostDto);
    return post.save();
  }

  async createComment(postId: string, createComment: CreateCommentDto) {
    const post = await this.postsModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.comments.push({
      comment: createComment.comment,
      username: createComment.username,
      createdAt: new Date(),
    });

    return post.save();
  }

  findAll() {
    return this.postsModel.find().sort({ updatedAt: -1 }).exec();
  }

  findOne(id: string) {
    return this.postsModel.findById(id).exec();
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.postsModel.findOneAndUpdate({ _id: id }, updatePostDto).exec();
  }

  async updateComment(postId: string, commentId: string, updateCommentDto: UpdateCommentDto) {
    const post = await this.postsModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = post.comments.find(
      (c: any) => c._id.toString() === commentId
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    Object.assign(comment, updateCommentDto);
    return post.save();
  }

  remove(id: string) {
    return this.postsModel.findOneAndDelete({ _id: id }).exec();
  }

  async removeComment(postId: string, commentId: string) {
    const post = await this.postsModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    post.comments = post.comments.filter(
      (comment: any) => comment._id.toString() !== commentId
    );
    return post.save();
  }

  async search(query: string) {
    if (query === 'Community') {
      query = '';
    }
    return this.postsModel.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { topic: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { community: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ updatedAt: -1 })
    .exec();
  }
}
