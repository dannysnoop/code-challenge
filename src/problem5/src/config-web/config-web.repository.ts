import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ConfigEntity } from '../../entities/config.entity';

@Injectable()
export class ConfigWebRepository extends Repository<ConfigEntity> {
  constructor(private dataSource: DataSource) {
    super(ConfigEntity, dataSource.createEntityManager());
  }
}
