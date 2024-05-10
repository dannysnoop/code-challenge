import { PostEntity } from '../../../entities/post.entity';

export class PostDto {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  isShowTop:boolean
}

export class PostCreateRequest extends PostEntity {}

export class PostUpdateRequest extends PostEntity {}
