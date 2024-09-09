import { Criteria } from '@app/common/models/criteria';
export interface CarrierEngagementAddEditViewCriteria extends Criteria {
    certificationType: string;
    carrierCodeCode: string;
    carrierCodeValue: string;
    dcsHost: string;
    version: string;
    certificationStartDate: string;
    status: string;
    cutoverDate: string;
}
