import { Criteria } from "@app/common/models/criteria";
export interface InterFlightSearchCriteria extends Criteria {
    departureDatefrom:string;
	depTimeFrom:string;
	departureDateTo:string;
	spinnerDep : number;
	depTimeTo:string;
	arrivalDateFrom:string;
	arrTimeFrom:string;
	spinnerArr: number;
	arrivalDateTo:string;
	arrTimeTo:string;

	departurePortKey:string;
	departurePortVal:string;
	
	arrivalPortKey:string;
	arrivalPortVal:string;
	
	flightKey:string;
	flightVal:string;
	
	carrierNameKey:string;
	carrierNameVal:string;

	scheduleType:string;
	scheduleTypeVal:string;
	flightDirection:string;
	flightDirectionVal:string;
}