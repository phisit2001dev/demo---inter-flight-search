import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionUserSearchCriteria {
	employeeCode: string;
	username: string;
	fullname: string;
	organization: string;
	email: string;
	active: string
	lockStatus: string;
	ids: string;
}
