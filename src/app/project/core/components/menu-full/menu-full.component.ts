import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { environment } from '@evn/environment';
import { of } from 'rxjs';
import { MenuNode } from './../../models/menu';
import { MenuDatabase } from './menu.database';

@Component({
  selector: 'app-menu-full',
  templateUrl: './menu-full.component.html',
  styleUrls: ['./menu-full.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MenuDatabase],
})
export class MenuFullComponent {
  nestedTreeControl: NestedTreeControl<MenuNode>;
  dataSource = [];
  columnMenu = environment.columnMenu;


  hasNestedChild = (_: number, node: MenuNode) =>
    node.children ? true : false;

  constructor(
    private database: MenuDatabase,
    private cdr: ChangeDetectorRef,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.nestedTreeControl = new NestedTreeControl<MenuNode>((node: MenuNode) =>
      of(node.children)
    );
    this.database.dataChange.subscribe((data) => {
      data.forEach((obj) => {
        const datasource = new MatTreeNestedDataSource<MenuNode>();
        datasource.data = new Array(obj);
        this.dataSource.push(datasource);
      });
      this.dataSource = this.convertMatrix(this.dataSource,this.columnMenu);
    });
  }

  convertMatrix(data: any,columMenu){
    let datasource = []
    let configColumn = 12%columMenu ? 3 : columMenu;
    let round = data.length % configColumn ? Math.trunc(data.length / configColumn)+1 : (data.length / configColumn);
    let temp = [];
    for (let i = 0; i < configColumn; i++) {
      if (i < configColumn) {
        temp.push(data[i]);
      }
      for (let j = 1; j < round; j++) {
        let index = i+(configColumn*j);
        if (index <= data.length) {
          let value = data[index];
          if (value) {
            temp.push(value);
          }
        }
      }
      datasource.push({column: i, data: temp});
      temp = [];
    }
    this.cdr.markForCheck();
    return datasource;
  }

  routerLinkCloseMenu(trigger: MatMenuTrigger){
    trigger.closeMenu();
    this.snackbar.dismiss();
  }
}
