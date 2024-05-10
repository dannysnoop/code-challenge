import { UserResponse } from '../../user/DTO/user.dto';
import { LicenseEntity } from '../../../entities/lisence.entity';
import { ApiProperty } from "@nestjs/swagger";
import { APP_TYPE } from "../../../helper/constant";

export class LicenseDto extends LicenseEntity {}

export class LicenseResponse extends UserResponse<LicenseDto> {}

export class LicenseCreateDto {
  @ApiProperty()
  activated: boolean;
  @ApiProperty()

  expireDate: string;
  @ApiProperty()

  userId: number;
  @ApiProperty()
  code: string;

  @ApiProperty()
  appType: APP_TYPE;
}
export class LicenseUpdateDto extends LicenseCreateDto {
}

export class LicenseRequest {
  username: string;
  take = 10;
  page = 1;
}
