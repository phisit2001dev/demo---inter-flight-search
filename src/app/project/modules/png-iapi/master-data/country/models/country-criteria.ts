import { Criteria } from '@app/common/models/criteria';

export interface CountrySearchCriteria extends Criteria {
  countryName: string;
  countryCodeAlp2: string;
  countryCodeAlp3: string;
  nationalityName: string;
  nationalityCode: string;
  continentCode: string;
  activeStatus: string;
}
