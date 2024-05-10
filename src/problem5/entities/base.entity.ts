import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @CreateDateColumn({ type: 'varchar', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;

  @UpdateDateColumn({ type: 'varchar', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: string;

  @BeforeInsert()
  updateTimestampsOnCreate() {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    this.createdAt = currentTimestamp.toString();
    this.updatedAt = currentTimestamp.toString();
  }

  @BeforeUpdate()
  updateTimestampOnUpdate() {
    this.updatedAt = Math.floor(new Date().getTime() / 1000).toString();
  }
}
