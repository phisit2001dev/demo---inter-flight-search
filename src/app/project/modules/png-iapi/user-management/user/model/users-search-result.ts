import { CommonDomain } from "@app/common/models/common-domain";

export interface UsersSearchResult extends CommonDomain {
	active: string;
	lockStatus: string;
	employeeCode: string;
	username: string;
	fullname: string;
	organizationName: string;
	doctypeRefUserNo: string;
	phoneNo: string;
	groupNameUser: string;
	groupNameHint: string;
}
