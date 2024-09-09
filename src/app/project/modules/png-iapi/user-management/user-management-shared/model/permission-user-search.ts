import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionUserSearch extends CommonDomain {
	employeeCode: string;
	username: string;
	fullname: string;
	organization: string;
	email: string;
	active: string
	lockStatus: string;
}
