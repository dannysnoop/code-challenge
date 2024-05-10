import { Inject, Injectable } from '@nestjs/common';
import { LicenseRepository } from './license.repository';
import { ILicenseService } from './i.license.service';
import {
  LicenseResponse,
  LicenseCreateDto,
  LicenseDto,
  LicenseUpdateDto,
  LicenseRequest,
} from './DTO/license.dto';
import { plainToInstance } from 'class-transformer';
import { LicenseEntity } from '../../entities/lisence.entity';
import { IUserService } from '../user/i.user.service';

@Injectable()
export class LicenseService implements ILicenseService {
  constructor(
    private repository: LicenseRepository,
    @Inject('IUserService') private readonly IUserService: IUserService,
  ) {}

  getOneLicense(id: number): Promise<LicenseDto> {
    return this.repository.findOne({
      where: { id },
      relations: { user: true },
    });
  }

  async getAllLicense(params: LicenseRequest): Promise<LicenseResponse> {
    const { username, page = 1, take = 10 } = params;
    const skip = (page - 1) * take || 0;

    const [data, count] = await this.repository.findAndCount({
      where: [{ user: { username: username } }, { user: { email: username } }],
      relations: { user: true },
      take,
      skip,
    });

    return new LicenseResponse(data, page, take, count);
  }
  async createLicense(params: LicenseCreateDto): Promise<LicenseDto> {
    const user = await this.IUserService.getUserById(params.userId);

    const data = plainToInstance(LicenseEntity, { ...params, user });
    return this.repository.save(data);
  }

  async updateLicense(
    id: number,
    params: LicenseUpdateDto,
  ): Promise<LicenseDto> {
    const license = await this.repository.findOne({ where: { id } });
    const data = plainToInstance(LicenseEntity, { ...license, ...params });
    return this.repository.save(data);
  }
}
