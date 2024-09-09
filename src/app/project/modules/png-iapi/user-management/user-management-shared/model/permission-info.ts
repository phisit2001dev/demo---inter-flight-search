import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionInfo extends CommonDomain {
	systemName: string;
	path: string;
	functionName: string;
}
