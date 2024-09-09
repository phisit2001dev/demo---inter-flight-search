import { CommonDomain } from "@app/common/models/common-domain";
import { InterFlightSearchCriteria } from "./inter-flight-search-criteria";

export interface InterFlightSearchExportRequest extends CommonDomain {
  criteria: InterFlightSearchCriteria;
}
