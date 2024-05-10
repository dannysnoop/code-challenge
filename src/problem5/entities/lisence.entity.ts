import {
  Column,
  Entity,
  JoinColumn, ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { APP_TYPE, ORDER_STATUS } from "../helper/constant";

@Entity('license')
export class LicenseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  code: string;
  @Column({ nullable: true })
  expireDate: string;
  @Column({ default: false })
  activated: boolean;
  @Column({
    type: 'enum',
    enum: APP_TYPE,
    default: APP_TYPE.TELEGRAM,
  })
  appType: APP_TYPE;
  @ManyToOne(() => UserEntity, (user) => user.licenses)
  user: UserEntity;
}
