import { CommonDomain } from "@app/common/models/common-domain";

export interface UsersAddEdit extends CommonDomain {
	active: string,
    lockStatus: string,
    employeeCode: string,
    prefixId: string,
    forename: string,
    surname: string,
    organizationId: string,
    positionName: string,
    email: string,
    doctypeRefUser: string,
    doctypeRefUserNo: string,
    cellPhone1: string,
    cellPhone2: string,
	cellPhone3: string,
    startDate: string,
    endDate: string,
    remark: string,
	groupNameUser: string;
}
