import { Criteria } from '@app/common/models/criteria';

export interface PrefixSearchCriteria extends Criteria {
  prefixType: string;
  prefixName: string;
  activeStatus: string;
}
