import { Criteria } from "@app/common/models/criteria";
export interface AirCarrierCriteria  extends Criteria {
    carrierCodeIata:string
    carrierCodeIcao:string
    carrierName:string
    countryName:string
    carrierType:string
    activeStatus:any
}