import { CommonDomain } from "@app/common/models/common-domain";

export interface UserGroupSearchResult extends CommonDomain {
	active: string;
	groupCode: string;
	groupName: string;
}
