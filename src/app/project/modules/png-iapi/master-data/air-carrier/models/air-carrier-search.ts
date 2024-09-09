import { CommonSearch } from './../../../../../../common/models/common-search';
export interface AirCarrierCriteriaSearch  extends CommonSearch {
    carrierCodeIata:string
    carrierCodeIcao:string
    carrierName:string
    countryName:string
    carrierType:string
    activeStatus:string
    
}