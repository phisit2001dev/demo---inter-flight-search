import { HeaderSort } from './header-sort';

export interface Criteria {
  checkMaxExceed?: boolean;
  linePerPage: number;
  pageIndex?: number;
  headerSorts?: HeaderSort[];
  isExpand?: boolean; // สำหรับ advanced search
}
