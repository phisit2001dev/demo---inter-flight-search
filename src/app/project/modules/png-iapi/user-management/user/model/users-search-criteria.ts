import { Criteria } from '@app/common/models/criteria';
export interface UsersSearchCriteria extends Criteria {
	active: string;
	lockStatus: string
	employeeCode: string
	username: string
	fullname: string
	forname: string
	surname: string
	organizationId: string
	doctypeRefUserNo: string
	groupUserId: string
}