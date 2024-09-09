export interface MenuNode {
  // operatorId: number;
  label: string;
  // operatorType?: string;
  // visible?: any;
  path?: string;
  iconName?: string;
  // parentId: number;
  // parentLabel?: string;
  // systemLabel?: string;
  children?: MenuNode[];
  // id?: number;
  // hiddenToken?: string;

  // listNo?: number;
  level?: number;

  // systemName?: null;
  // menuName?: string;
  // functionName?: string;
  // operatorNameTH?: string;
  // operatorNameEN?: string;
  // parentOperatorNameEN?: string;
  // parentOperatorNameTH?: string;
  // groupOperatorNameEN?: string;
  // groupOperatorNameTH?: string;
  // active?: string;
  // detail?: string;
}
