import { CommonDomain } from "@app/common/models/common-domain";
import { PermissionInfo } from "./permission-info";

export class OperatorFlatNode implements PermissionInfo {
	expandable: boolean;
	operatorType: string;
	level: number;
	display: string = "flex";

	hiddenToken: string;
	systemName: string;
	path: string;
	functionName: string;
}
