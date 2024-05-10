import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LicenseEntity } from '../../entities/lisence.entity';

@Injectable()
export class LicenseRepository extends Repository<LicenseEntity> {
  constructor(private dataSource: DataSource) {
    super(LicenseEntity, dataSource.createEntityManager());
  }
}
