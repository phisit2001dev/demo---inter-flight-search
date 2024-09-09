import { Criteria } from '@app/common/models/criteria';
export interface UserGroupSearchCriteria extends Criteria {
    groupCode: string;
    groupName: string;
    active: string;
}
