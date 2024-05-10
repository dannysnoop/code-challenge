import { Body, Controller, Get, HttpStatus, Inject, Put } from '@nestjs/common';
import { IConfigWebService } from './i.config-web.service';
import { ApiBody, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { COMMON_MESSAGE } from '../../helper/message';
import { ConfigWebDto } from './DTO/config-web.dto';

@Controller('api/config-web')
@ApiTags('config-web')
export class ConfigWebController {
  constructor(
    @Inject('IConfigWebService')
    private readonly IConfigWebService: IConfigWebService,
  ) {}
  @Get()
  getConfigWeb() {
    return this.IConfigWebService.getConfig();
  }

  @Put()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: ConfigWebDto })
  updateConfigWeb(@Body() params: ConfigWebDto) {
    return this.IConfigWebService.updateConfig(params);
  }
}
