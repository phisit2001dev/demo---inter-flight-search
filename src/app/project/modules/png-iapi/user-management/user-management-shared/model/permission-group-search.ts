import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionGroupSearch extends CommonDomain {
	activeStatus: string;
	groupCode: string;
	groupName: string;
}
