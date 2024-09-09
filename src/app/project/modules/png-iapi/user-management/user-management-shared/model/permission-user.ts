import { CommonDomain } from "@app/common/models/common-domain";
import { Permission } from "@app/common/models/permission";
import { Criteria } from "@app/common/models/criteria";
import { CommonSelectItem } from "@app/common/models/common-select-item";

export interface PermissionInfo extends CommonDomain {
	permission: Permission;
	criteria: Criteria;
	listOrganization: CommonSelectItem[];
	listLockStatus: CommonSelectItem[];

}
