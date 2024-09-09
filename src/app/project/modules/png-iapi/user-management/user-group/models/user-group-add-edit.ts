import { CommonDomain } from "@app/common/models/common-domain";

export interface UserGroupAddEdit extends CommonDomain {
	active: string;
	groupCode: string;
	groupName: string;
}
