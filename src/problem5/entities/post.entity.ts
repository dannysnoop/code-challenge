import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ type: 'varchar', length: 255 })
  @ApiProperty()
  title: string;
  @Column({ type: 'varchar' })
  @ApiProperty()
  content: string;
  @Column({ default: true })
  @ApiProperty()
  isShow: boolean;
  @Column({ default: true })
  @ApiProperty({ default: false })
  isShowTop: boolean;
  @Column({ default: false })
  @ApiProperty({ default: false })
  isRequiredBalanceForLookUp: boolean;
  @Column({ default: false })
  @ApiProperty()
  isRequiredForComment: boolean;
  @ApiProperty()
  @Column({ default: 0 })
  priceRequired: number;
}
