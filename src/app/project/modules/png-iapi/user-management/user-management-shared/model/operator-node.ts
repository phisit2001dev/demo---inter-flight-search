import { CommonDomain } from "@app/common/models/common-domain";

export class OperatorNode {
	hiddenToken: string;
	operatorType: string;								
	systemName: string;
	path: string;
	functionName: string;
	children?: OperatorNode[];
	display: string = "flex";
}
