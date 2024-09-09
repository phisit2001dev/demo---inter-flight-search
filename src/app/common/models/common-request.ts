import { CommonDomain } from "./common-domain";
import { Permission } from "./permission";

export interface CommonRequest extends CommonDomain {
  permission?: Permission;
}
