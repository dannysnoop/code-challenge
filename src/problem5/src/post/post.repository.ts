import { Get, Injectable, Post, Put } from "@nestjs/common";
import { DataSource, Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(private dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }



}
