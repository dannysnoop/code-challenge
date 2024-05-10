import { Injectable } from '@nestjs/common';
import { IConfigWebService } from './i.config-web.service';
import { ConfigWebDto } from './DTO/config-web.dto';
import { ConfigWebRepository } from './config-web.repository';
import { plainToInstance } from 'class-transformer';
import { ConfigEntity } from '../../entities/config.entity';

@Injectable()
export class ConfigWebService implements IConfigWebService {
  constructor(private readonly repository: ConfigWebRepository) {}
  createConfig(param: ConfigWebDto): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async updateConfig(param: ConfigWebDto): Promise<any> {
    const config = await this.repository.findOneByOrFail({ id: 1 });
    const dataSave = plainToInstance(ConfigEntity, { ...config, ...param });
    await this.repository.save(dataSave);
  }
  async getConfig(): Promise<ConfigWebDto> {
    return this.repository.findOneByOrFail({ id: 1 });
  }
}
