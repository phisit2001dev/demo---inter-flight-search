import { MainNavService } from '@app/project/core/services/main-nav.service';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { MenuNode } from '../../models/menu';
import { Profile } from '../../models/profile';
import { SessionStorageService } from '../../services/session-storage.service';

@Injectable()
export class MenuDatabase implements OnDestroy {
  dataChange: BehaviorSubject<MenuNode[]> = new BehaviorSubject<MenuNode[]>([]);
  get data(): MenuNode[] {
    return this.dataChange.value;
  }

  private subscription: Subscription;

  constructor(private sessionStorageService: SessionStorageService) {
    // subscribe เพื่อรอข้อมูลที่ sessionStorage
    this.sessionStorageService.getIsLoginAsObS()
      // .pipe(take(1))
      .subscribe(res => {

        if (res) {
          /* && auth.loggedIn) {*/
          if (this.dataChange.value.length === 0) {
            const profile: Profile = JSON.parse(this.sessionStorageService.getProfile());
              if (profile.listOperator) {
              this.dataChange.next(profile.listOperator);
            }
          }
        } else {
          this.dataChange.next([]);
        }
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // private createTree(menu: MenuNode[]): MenuNode[] {
  //   const tree = [];
  //   const mappedArray: { key; element }[] = [];
  //   // console.log(menu, 'side-menu');
  //   // First map the nodes of the array to an object -> create a hash table.
  //   for (let i = 0, len = menu.length; i < len; i++) {
  //     const element = menu[i];
  //     const key = element.operatorId;
  //     mappedArray.push({ key, element });
  //   }
  //   // tslint:disable-next-line: forin
  //   for (const index in mappedArray) {
  //     // if (mappedArray.hasOwnProperty(id)) {
  //     const mappedElem: MenuNode = mappedArray[index].element;

  //     // If the element is not at the root level, add it to its parent array of children.
  //     if (mappedElem.parentId) {
  //       // console.log(mappedElem);
  //       const parent = mappedArray.filter(
  //         (val) => mappedElem.parentId === val.key
  //       )[0].element;
  //       if (!parent.children) {
  //         parent.children = [];
  //       }
  //       parent.children.push(mappedElem);
  //     }
  //     // If the element is at the root level, add it to first level elements array.
  //     else {
  //       tree.push(mappedElem);
  //     }
  //     // }
  //   }
  //   return tree;
  // }

}
