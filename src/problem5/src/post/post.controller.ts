import {
  Body,
  Controller, Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put
} from "@nestjs/common";
import { IPostService } from './i.post.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { COMMON_MESSAGE } from '../../helper/message';
import { ConfigWebDto } from '../config-web/DTO/config-web.dto';
import { PostEntity } from '../../entities/post.entity';
import { PostCreateRequest, PostUpdateRequest } from './DTO/post.dto';

@Controller('api/post')
@ApiTags('post')
export class PostController {
  constructor(
    @Inject('IPostService')
    private readonly IPostService: IPostService,
  ) {}

  @Get()
  getAllPost() {
    return this.IPostService.getListPost();
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: PostEntity })
  createPost(@Body() params: PostCreateRequest) {
    return this.IPostService.createPost(params);
  }

  @Put('/:id')
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: PostEntity })
  updatePost(@Param('id') id: number, @Body() params: PostUpdateRequest) {
    return this.IPostService.updatePost(id, params);
  }

  @Get('/:id')
  getPostDetail(@Param('id') id: number) {
    return this.IPostService.getDetailPost(id);
  }

  @Delete('/:id')
  removePostDetail(@Param('id') id: number) {
    return this.IPostService.removePost(id);
  }
}
