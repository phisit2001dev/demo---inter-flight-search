import { Criteria } from '@app/common/models/criteria';
export interface InterAirCarrierEngagementCriteria extends Criteria {
    carrierCodeCode: string;
    carrierCodeValue: string;
    dcsHost: string;
    certtificationType: string;
    status: string;
}