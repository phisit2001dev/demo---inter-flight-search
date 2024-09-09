import { MenuNode } from './menu';

export interface Profile {
  username?: string;
  fullname?: string;
  language?: string;
  changelogRead?: string;
  listOperator?: MenuNode[];
  timeZone: string;
  msgAlert?: Map<string, string>;
}

export interface Environment {
  version: string;
	type: string;
}
