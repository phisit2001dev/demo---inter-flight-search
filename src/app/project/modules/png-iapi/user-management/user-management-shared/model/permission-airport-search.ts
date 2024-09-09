import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionAirportSearch extends CommonDomain {
	airportCode: string;
	airportName: string;
	active: string;
}
