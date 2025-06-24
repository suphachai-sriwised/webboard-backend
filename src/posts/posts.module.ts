import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Posts, PostsSchema } from './schemas/posts.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Posts.name, schema: PostsSchema }])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
