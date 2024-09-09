import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionGroupSearchCriteria extends CommonDomain {
	activeStatus: string;
	groupCode: string;
	groupName: string;
    ids: string;
}