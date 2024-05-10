import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ALERT_CONFIG, SHOW_PRODUCT_TYPE } from '../helper/constant';
@Entity('config')
export class ConfigEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ default: 1 })
  interfaceType: number;

  @Column({
    type: 'enum',
    enum: SHOW_PRODUCT_TYPE,
    default: SHOW_PRODUCT_TYPE.DEFAULT,
  })
  showProductType: SHOW_PRODUCT_TYPE;
  @Column({
    type: 'enum',
    enum: ALERT_CONFIG,
    default: ALERT_CONFIG.TOP_MAIN,
  })
  alertType: ALERT_CONFIG;

  @Column({ default: true })
  isShowHistoryBuySell: boolean;
  @Column()
  isShowRecap: boolean;

  @Column({ default: false })
  loginGoogle: boolean;
  @Column({ default: false })
  loginTelegram: boolean;
  @Column({ default: 0 })
  limitIpOnDomain: number;
  @Column({ nullable: true })
  timeCloseAlert: number;
  @Column({ nullable: true })
  favicon: string;
  @Column({ nullable: true })
  avatar: string;
  @Column({ nullable: true })
  logo: string;
  @Column({ nullable: true })
  nameWebsite: string;
  @Column({ nullable: true })
  titleWebsite: string;
  @Column({ nullable: true })
  descriptionWebsite: string;
  @Column({ nullable: true })
  adminEmail: string;
  @Column({ nullable: true })
  affiliate: number;
  @Column({ nullable: true })
  promotionNumber: number;
  @Column({ nullable: true })
  minBalanceToTakePromotion: number;
  @Column({ nullable: true })
  isShowACB: boolean;
  @Column({ nullable: true })
  ACB_AccountNumber: string;
  @Column({ nullable: true })
  ACB_AccountName: string;
  @Column({ nullable: true })
  ACB_AccountNameApp: string;
  @Column({ nullable: true })
  ACB_AccountPass: string;
  @Column({ nullable: true })
  SyntaxTransfer: string;
  @Column({ nullable: true })
  zaloSupportPhoneNumber: string;
  @Column({ nullable: true })
  AlertLineRunning: string;
  @Column({ nullable: true })
  AlertTopPage: string;
  @Column({ nullable: true })
  TokenBM: string;
  @Column({ nullable: true })
  warrantyPolicy: string;
  @Column({ nullable: true })
  warrantyDenied: string;
  @Column({ nullable: true })
  contentTXTDownload: string;
  @Column({ nullable: true })
  GoogleAnalyticsCode: string;

  @Column({ nullable: true })
  linkImageBank: string;
}
