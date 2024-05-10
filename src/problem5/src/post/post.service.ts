import { Injectable } from '@nestjs/common';
import { IPostService } from './i.post.service';
import { PostEntity } from 'entities/post.entity';
import { PostCreateRequest, PostDto, PostUpdateRequest } from './DTO/post.dto';
import { PostRepository } from './post.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService implements IPostService {
  constructor(private readonly repository: PostRepository) {}

  removePost(id: number): void {
    this.repository.delete(id);
  }
  async createPost(params: PostCreateRequest): Promise<PostEntity> {
    const data = plainToInstance(PostEntity, params);
    return this.repository.save(data);
  }
  async updatePost(id: number, params: PostUpdateRequest): Promise<PostEntity> {
    const data = await this.repository.findOneByOrFail({ id });
    const dataSave = plainToInstance(PostEntity, { ...data, ...params });
    return this.repository.save(dataSave);
  }
  async getListPost(): Promise<PostDto[]> {
    const data = await this.repository.find();
    return data.map(mapPostEntityToDto);
  }
  async getDetailPost(id: number): Promise<PostEntity> {
    const data = await this.repository.findOneByOrFail({ id });
    return data;
  }
}

const mapPostEntityToDto = (post: PostEntity): PostDto => {
  const { title, createdAt, updatedAt, id, isShowTop } = post;
  return {
    title,
    createdAt,
    updatedAt,
    id,
    isShowTop
  };
};
