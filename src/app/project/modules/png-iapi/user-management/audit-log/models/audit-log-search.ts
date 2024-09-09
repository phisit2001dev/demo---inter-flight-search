import { Criteria } from "@app/common/models/criteria";
export interface AuditLogSearch  extends Criteria {
    dateStart: string
    dateEnd: string
    timeStart: string
    timeEnd: string
    system: string
    function: string
    username: string
    employeeCode: string
    name: string
    surname: string
}