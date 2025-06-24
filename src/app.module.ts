import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    PostsModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      // ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    MongooseModule.forRoot('mongodb://root:example@localhost:27017/webboard?authSource=admin'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
