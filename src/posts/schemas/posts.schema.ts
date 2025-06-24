
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PostsDocument = HydratedDocument<Posts>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  comment: string;

  @Prop({ required: true })
  username: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Posts {
  @Prop()
  topic: string;

  @Prop()
  content: string;

  @Prop()
  community: string;

  @Prop()
  username: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
