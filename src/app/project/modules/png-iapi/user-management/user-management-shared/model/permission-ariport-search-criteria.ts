import { CommonDomain } from "@app/common/models/common-domain";

export interface PermissionAirportSearchCriteria {
	airportCode: string;
	airportName: string;
	active: string;
	ids: string
}
