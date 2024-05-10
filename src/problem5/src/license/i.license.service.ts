import {
  LicenseCreateDto,
  LicenseDto,
  LicenseRequest,
  LicenseResponse,
  LicenseUpdateDto,
} from './DTO/license.dto';

export interface ILicenseService {
  getAllLicense(params: LicenseRequest): Promise<LicenseResponse>;
  createLicense(params: LicenseCreateDto): Promise<LicenseDto>;
  updateLicense(id: number, params: LicenseUpdateDto): Promise<LicenseDto>;
  getOneLicense(id: number): Promise<LicenseDto>;
}
