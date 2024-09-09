import { CommonSearch } from './../../../../../../common/models/common-search';

export interface CountrySearch extends CommonSearch {
  countryCodeAlp2: string;
  countryCodeAlp3: string;
  countryName: string;
  nationalityCode: string;
  nationalityName: string;
  continentName: string;
  activeStatus: string;
}
