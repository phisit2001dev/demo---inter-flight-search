import { CommonError } from '@app/common/models/common-error';

export interface CommonResponse {
  actionToken: string;
  messageCode: string;
  messageDesc: string;
  data: any;
  componentType: string; // what kind of UI that need to be show ?
  displayStatus: string; // what type of this UI suppose to be eg. success, error, warn or info
  error: CommonError;
  invalid: InValidInput[];
}

export interface InValidInput {
  element: string;
  msg: string;
}
