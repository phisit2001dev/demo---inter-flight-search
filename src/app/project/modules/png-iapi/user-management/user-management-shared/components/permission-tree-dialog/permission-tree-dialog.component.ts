import { ChangeDetectionStrategy, Inject, OnDestroy } from '@angular/core';
import { Component, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { OperatorNode } from '../../model/operator-node';
import { OperatorFlatNode } from '../../model/operator-flat-node';
import {BehaviorSubject, Subscription} from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<OperatorNode[]>([]);

  get data(): OperatorNode[] {
    return this.dataChange.value;
  }

  initialize(treeData: OperatorNode[] ) {
    // Notify the change.
    this.dataChange.next(treeData);
  }
}
@Component({
  selector: 'app-permission-tree-dialog',
  templateUrl: './permission-tree-dialog.component.html',
  styleUrls: ['./permission-tree-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChecklistDatabase]
})
export class PermissionTreeDialogComponent implements OnDestroy {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<OperatorFlatNode, OperatorNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<OperatorNode, OperatorFlatNode>();

  /** A selected parent node to be inserted */
  // selectedParent: OperatorFlatNode | null = null;

  treeControl: FlatTreeControl<OperatorFlatNode>;

  treeFlattener: MatTreeFlattener<OperatorNode, OperatorFlatNode>;

  dataSource: MatTreeFlatDataSource<OperatorNode, OperatorFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<OperatorFlatNode>(true /* multiple */);

  dataChange$: Subscription;

  constructor(
    private _database: ChecklistDatabase,
    public dialogRef: MatDialogRef<PermissionTreeDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService) {
    _database.initialize(dialogData.listOperator);

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<OperatorFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.dataChange$  = _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  
    dialogData.listSelected.forEach((itemSelected) => {
      this.treeControl.dataNodes.forEach((itemNode) => {
        if ((itemNode.systemName === itemSelected.systemName)
              && (itemNode.path === itemSelected.path)
              && (itemNode.functionName === itemSelected.functionName)) {
            this.todoLeafItemSelectionToggle(itemNode); 
            let parent = undefined;
            for (let l = itemNode.level; l >= 0; l--) {
                if (parent === undefined) {
                  parent = this.getParentNode(itemNode);
                } else {
                  parent = this.getParentNode(parent);
                }
                this.treeControl.expand( parent );
            }   
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.dataChange$.unsubscribe();
  }

  getLevel = (node: OperatorFlatNode) => node.level;

  isExpandable = (node: OperatorFlatNode) => node.expandable;

  getChildren = (node: OperatorNode): OperatorNode[] => node.children;

  hasChild = (_: number, _nodeData: OperatorFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: OperatorFlatNode) => _nodeData.functionName === '';

  // filter recursively on a text string using property object value
  filterRecursive(filterText: string, array: any[], property: string) {
    let filteredData;

    //make a copy of the data so we don't mutate the original
    function copy(o: any) {
      return Object.assign({}, o);
    }

    // has string
    if (filterText) {
      // need the string to match the property value
      filterText = filterText.toLowerCase();
      // copy obj so we don't mutate it and filter
      filteredData = array.map(copy).filter(function x(y) {
        if (y[property].toLowerCase().includes(filterText)) {
          return true;
        }
        // if children match
        if (y.children) {
          return (y.children = y.children.map(copy).filter(x)).length;
        }
      });
      // no string, return whole array
    } else {
      filteredData = array;
    }

    return filteredData;
  }

  haveFilter: boolean = false;
  filterRecursiveVisible(filterText: string, array: any[], property: string) {
    let filteredData;

    // has string
    if (filterText) {
      this.haveFilter = true;
      // need the string to match the property value
      filterText = filterText.toLowerCase();
      // copy obj so we don't mutate it and filter
      filteredData = array.filter(function x(y) {
        if (y[property].toLowerCase().includes(filterText)) {
          y['display']='flex';
        } else {
          y['display']='none';
        }


        // if children match fix 5 level
        if ( (y['operatorType']==='M') && (y['display']==='flex') ) {
          let children_l1 = y.children.filter(x);
          children_l1.forEach((c_l1)=> {
            c_l1['display']='flex';
            if ( (c_l1['operatorType']==='M') ) {

              let children_l2 = c_l1.children.filter(x);
              children_l2.forEach((c_l2)=> {
                c_l2['display']='flex';
                if ( (c_l2['operatorType']==='M') ) {
                
                  let children_l3 = c_l2.children.filter(x);
                  children_l3.forEach((c_l3)=> {
                    c_l3['display']='flex';
                    if ( (c_l3['operatorType']==='M') ) {

                      let children_l4 = c_l3.children.filter(x);
                      children_l4.forEach((c_l4)=> {
                        c_l4['display']='flex';
                        if ( (c_l4['operatorType']==='M') ) {

                          let children_l5 = c_l4.children.filter(x);
                          children_l5.forEach((c_l5)=> {
                            c_l5['display']='flex';
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });

          /**
          y.children.filter(x).forEach((c)=> {
            c['display']='flex';
          });
          */
        } else if (y.children) {
            y.children.filter(x).forEach((c)=> {
              if (c['display']==='flex') {
                y['display']='flex';
              }
            });
        }
        
        /**
        // if children match
        if (y.children) {
          y.children.filter(x).forEach((c)=> {
            if (c['display']==='flex') {
              y['display']='flex';
            }
          });
        }
        **/
        return true;
      });
      // no string, return whole array
    } else {
      this.haveFilter = false;
      filteredData = array.filter(function x(y) {
        y['display']='flex';
        if (y.children) {
          y.children.filter(x).forEach((c)=> {
              y['display']='flex';
          });
        }
        return true;
      });
    }
    return filteredData;
  }

  displayChildren(y: any, x: Function) {
    let children = y.children.filter(x);
    children.forEach((c)=> {
      c['display']='flex';
    });
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: OperatorNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.functionName === node.functionName ? existingNode : new OperatorFlatNode();
    flatNode.hiddenToken = node.hiddenToken;
    flatNode.systemName = node.systemName;
    flatNode.path = node.path;
    flatNode.functionName = node.functionName;
    flatNode.level = level;
    flatNode.operatorType = node.operatorType;
    flatNode.expandable = !!node.children?.length;
    if (!node.display) {
      node.display = 'flex';
    }
    flatNode.display = node.display;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: OperatorFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: OperatorFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: OperatorFlatNode): void {
    // console.log('core', 'item');
    // console.log('core', el);
    // console.log('core', el.checked);
    // if (el.checked !== this.checklistSelection.isSelected(node)) {
    //   console.log('core', 'Hit');
    //   return;
    // }
    // descendants = this.treeControl.getDescendants(node);
    // descendants = descendants.filter(function x(y) {
    //   return  (y.display === 'flex');
    // });

    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: OperatorFlatNode): void {
    // console.log('core', 'leaf');
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: OperatorFlatNode): void {
    let parent: OperatorFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: OperatorFlatNode): void {
    // descendants = descendants.filter(function x(y) {
    //   return true; // (y.display === 'flex');
    // });

    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: OperatorFlatNode): OperatorFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  
  choose() {
    if (this.checklistSelection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }

    // const MENU_PATH_SEPARATOR = " › ";
    let nodes: OperatorFlatNode[] = [];
    this.treeControl.dataNodes.forEach(item => {
      if (this.checklistSelection.isSelected(item)) {
        // เรียงลำดับตาม tree 
        // this.checklistSelection.selected.forEach((item) => {
          if (item.operatorType === 'F') {
            nodes[nodes.length] = item;
            // let parent = null;
            // for (let i = item.level; i >= 1; i--) {
            //   if (parent === null) {
            //     parent = this.getParentNode(item);
            //   } else {
            //     parent = this.getParentNode(parent);
            //   }
            //   item.functionName = parent.functionName + MENU_PATH_SEPARATOR + item.functionName;
            // }
    
            // let indexFirstOfPath = item.functionName.indexOf(MENU_PATH_SEPARATOR);
            // item.systemName = item.functionName.substring(0, indexFirstOfPath);
    
            // let indexLastOfPath = item.functionName.lastIndexOf(MENU_PATH_SEPARATOR);
            // item.functionName = item.functionName.substring(indexLastOfPath + MENU_PATH_SEPARATOR.length, item.functionName.length);
    
            // item.path = item.functionName.substring(indexFirstOfPath + MENU_PATH_SEPARATOR.length, indexLastOfPath);
            // item.functionName = "";
    
            // item.hiddenToken = item.operatorId;
            // item.operatorId = "";
          }
        // });
      }
    });
    this.dialogRef.close(nodes);
  }

  close() {
    this.dialogRef.close();
  }

  deselectAll() {
    if (this.haveFilter) {
      let elementDeselect = this.treeControl.dataNodes.filter(function x(element) {
        return (element.display === 'flex');
      });
      this.checklistSelection.deselect(...elementDeselect);
    } else {
      this.checklistSelection.deselect(...this.treeControl.dataNodes);
    }
  }

  selectAll() {
    if (this.haveFilter) {
      let elementSelect = this.treeControl.dataNodes.filter(function x(element) {
        return (element.display === 'flex');
      });
      this.checklistSelection.select(...elementSelect);
    } else {
      this.checklistSelection.select(...this.treeControl.dataNodes);
    }
  }

  collapseAll() {
    this.treeControl.collapseAll();
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  // pass mat input string to recursive function and return data
  filterTree(filterText: string) {
    // use filter input text, return filtered TREE_DATA, use the 'name' object value
    this.dataSource.data = this.filterRecursiveVisible(filterText, this._database.dataChange.getValue(), 'label');
  }

  // filter string from mat input filter
  applyFilter(filterText: string) {
    this.filterTree(filterText);
    // show / hide based on state of filter string
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  /**
   * Checkbox master toggle
   */
  masterToggle(element: any) {
    let selected = element.checked;
    if (selected) {
      this.selectAll();
    } else {
      this.deselectAll();
    }
  }

  isCheckedAll() {
    let elSelected = this.checklistSelection.selected;
    const numSelected = elSelected.length;

    let elRows = this.treeControl.dataNodes;
    const numRows = elRows.length;
    const allSelected = (numSelected === numRows);
    return this.checklistSelection.hasValue() && allSelected;
  }

  isIndeterminateAll() {
    let elSelected = this.checklistSelection.selected;
    const numSelected = elSelected.length;

    let elRows = this.treeControl.dataNodes;
    const numRows = elRows.length;
    const allSelected = (numSelected === numRows);
    return this.checklistSelection.hasValue() && !allSelected;
  }

  isCheckedFilter() {
    const isCheckedFilter = this.isFlexSelected();
    return this.hasFlexSelected() && isCheckedFilter;
  }

  isIndeterminateFilter() {
    const isIndeterminateFilter = !this.isFlexSelected();
    return this.hasFlexSelected() && isIndeterminateFilter;
  }

  hasFlexSelected() {
    const numSelectedFlex = this.checklistSelection.selected?.filter(function x(element) {
      return (element.display === 'flex')  && (element.operatorType === 'F');
    });
    return numSelectedFlex.length > 0;
  }

  findDataNodesFlexTypeF() {
    return this.treeControl.dataNodes.filter(function x(element) {
      return (element.display === 'flex') && (element.operatorType === 'F');
    });
  }

  isFlexSelected() {
    const numSelectedFlex = this.checklistSelection.selected?.filter(function x(element) {
      return (element.display === 'flex')  && (element.operatorType === 'F');
    });
    const numRowsFlex = this.findDataNodesFlexTypeF()?.length;
    return numSelectedFlex.length === numRowsFlex;
  }

  isCheckedTree(node: OperatorFlatNode): boolean {
    let countSeleted = 0;
    let descendants = this.treeControl.getDescendants(node);
    descendants.forEach(element => {
      if (this.checklistSelection.isSelected(element)) {
        countSeleted++;
      };
    });
    // console.log('core chk', countSeleted, descendants.length, (countSeleted === descendants.length));
    return (countSeleted > 0) && (countSeleted === descendants.length);
  }

  isIndeterminateTree(node: OperatorFlatNode): boolean {
    let countSeleted = 0;
    let descendants = this.treeControl.getDescendants(node);
    descendants.forEach(element => {
      if (this.checklistSelection.isSelected(element)) {
        countSeleted++;
      };
    });
    // console.log('core ind', countSeleted, descendants.length, (countSeleted < descendants.length));
    return (countSeleted > 0) && (countSeleted < descendants.length);
  }

  isCheckedTreeFilter(node: OperatorFlatNode): boolean {
    let countSeleted = 0;
    let descendants = this.treeControl.getDescendants(node);
    descendants = descendants.filter(x => {
      return  true;//(x.display === 'flex');
    });
    descendants.forEach(element => {
      if (this.checklistSelection.isSelected(element)) {
        countSeleted++;
      };
    });
    const status = (countSeleted > 0) && (countSeleted === descendants.length);
    return status;
  }

  isIndeterminateTreeFilter(node: OperatorFlatNode): boolean {
    let countSeleted = 0;
    let descendants = this.treeControl.getDescendants(node);
    descendants = descendants.filter(x => {
      return true;// (x.display === 'flex');
    });
    descendants.forEach(element => {
      if (this.checklistSelection.isSelected(element)) {
        countSeleted++;
      };
    });
    return (countSeleted > 0) && (countSeleted < descendants.length);
  }
}
