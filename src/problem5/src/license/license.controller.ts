import { Body, Controller, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ILicenseService } from "./i.license.service";
import { LicenseCreateDto, LicenseRequest, LicenseUpdateDto } from "./DTO/license.dto";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorator/roles.decorator";
import { ROLE } from "../../helper/constant";

@Controller('license')
@ApiTags('license')
@ApiBearerAuth()


export class LicenseController {
  constructor(
    @Inject('ILicenseService')
    private readonly ILicenseService: ILicenseService,
  ) {}

  @Get()
  @ApiQuery({ name: 'username', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  getAllLicense(@Query() params: LicenseRequest) {
    return this.ILicenseService.getAllLicense(params);
  }
  @Get('/:id')
  getOneLicense(@Param('id') id: number) {
    return this.ILicenseService.getOneLicense(id);
  }
  @Post()
  @ApiBody({ type: LicenseCreateDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  createLicense(@Body() params: LicenseCreateDto) {
    return this.ILicenseService.createLicense(params);
  }

  @Put('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  @ApiBody({ type: LicenseUpdateDto })
  updateLicense(@Param('id') id: number, @Body() params: LicenseUpdateDto) {
    return this.ILicenseService.updateLicense(id, params);
  }
}
