import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put, Query,
  UseGuards
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse, ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { ICategoryService } from './i.category.service';
import { COMMON_MESSAGE } from '../../helper/message';
import {
  CategoryCreateRequest, CategorySearchQueryRequest,
  CategoryUpdateRequest
} from "./DTO/category.dto";
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorator/roles.decorator';
import { ROLE } from '../../helper/constant';

@Controller('api/category')
@ApiTags('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly ICategoryService: ICategoryService,
  ) {}
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  GetCategories() {
    return this.ICategoryService.getAllCategory();
  }


  @Get('/search')
  @ApiQuery({ name: 'productName', type: String })
  GetCategoriesSearch(@Query() body : CategorySearchQueryRequest) {
    return this.ICategoryService.searchProductThoughCategory(body.productName);
  }

  @Get('/client')
  @UseGuards(AuthGuard)
  GetCategoriesForClient() {
    return this.ICategoryService.getAllCategoryForClient();
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBody({ type: CategoryCreateRequest })
  CreateCategory(@Body() params: CategoryCreateRequest) {
    return this.ICategoryService.createCategory(params);
  }

  @Put('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  UpdateCategory(
    @Param('id') id: number,
    @Body() params: CategoryUpdateRequest,
  ) {
    return this.ICategoryService.updateCategory(id, params);
  }

  @Get('/:id')
  GetCategoryById(@Param('id') id: number) {
    return this.ICategoryService.getCategoryById(id);
  }
}
