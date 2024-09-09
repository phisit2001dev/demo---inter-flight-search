import { CommonSearch } from './../../../../../../common/models/common-search';

export interface PrefixSearch extends CommonSearch {
  activeStatus: string;
  prefixType: string;
  prefixName: string;
  abbreviation: string;
}
