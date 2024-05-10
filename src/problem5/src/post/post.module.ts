import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { ConfigWebService } from '../config-web/config-web.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    PostRepository,
    { provide: 'IPostService', useClass: PostService },
  ],
  exports: [PostService, PostRepository],
})
export class PostModule {}
