import { AfterViewInit, ChangeDetectorRef, ContentChildren, Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, QueryList, Renderer2, SimpleChanges } from '@angular/core';
import { MatSortable, MatSortHeader, SortDirection } from '@angular/material/sort';
import { HeaderSort } from '@app/common/models/header-sort';
import { Subject, take, takeUntil } from 'rxjs';

@Directive({
  selector: '[sitSortActive]',
})
export class MultiplesortDirective implements OnChanges, AfterViewInit, OnDestroy {

  @ContentChildren(MatSortHeader) sort = new QueryList<MatSortHeader>;
  @Input() sitSortActive: any;
  @Input() dataSource: any;

  // paramFormSort;
  private destroy$ = new Subject();

  constructor(private el: ElementRef,changeDetect: ChangeDetectorRef,renderer: Renderer2,private zone: NgZone)
  {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  /**
   * @description detected sort
   * @memberof MultiplesortDirective
   */
  ngAfterViewInit(): void {
    this.sort.changes.pipe(take(1)).subscribe((sortInit)=> {
      this.sort?.first._sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe(()=> {
        this.el.nativeElement.classList.remove('sort-custom');
      });
    });
  }

  /**
   *
   * @memberof MultiplesortDirective
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes?.sitSortActive?.previousValue && !changes?.sitSortActive?.firstChange && this.sitSortActive.length > 0) {
      this.processDefaultMatSort(this.sort);
    }
  }

  /**
   * @disable
   * @param sort
  */
  // processInitMatSort(sort: QueryList<MatSortHeader>){
  //   this.el.nativeElement.classList.add('sort-custom');
  //   if (this.sitSortActive.length > 0){
  //     this.sitSortActive.forEach((form: {columnName: string, order: string, sorted: boolean}) => {
  //       if (form.sorted) {
  //         let contentSort = sort.find((v) => v.id === form.columnName);
  //         if (contentSort) {
  //           let order = form.order.toLowerCase() as SortDirection;
  //           let ele = (this.el.nativeElement as Element).querySelector(`th[mat-sort-header="${contentSort.id}"]`);
  //           ele.classList.add(`display-sort-${order}`);
  //         }
  //       }
  //     });
  //   }
  // }

  /**
   *
   * @param sort
  */
  processDefaultMatSort(sort: QueryList<MatSortHeader>){
    if (this.sitSortActive.length > 1){
      // มี การกำหนด sort
      this.sort?.forEach((matSort)=> {
        // หา matSort ที่ตรงกับการทำ default sort
        let target = this.sitSortActive?.find((element : HeaderSort) => element.columnName === matSort.id);
        let ele = (this.el.nativeElement as Element).querySelector(`th[mat-sort-header="${matSort.id}"]`);
        if (target) {
          // set default sort
          if (matSort._isSorted()) {
            matSort._sort.active = null;
            matSort._sort.direction = null;
          }
          let formOrder = target.order.toLowerCase() as SortDirection;
          this.clearClassArrow(ele);
          ele.classList.add(`display-sort-${formOrder}`);
        }else {
          // reset
          this.clearClassArrow(ele);
          if (matSort._isSorted()) {
            matSort._disableViewStateAnimation = true;
            matSort._setAnimationTransitionState({fromState: 'active', toState: 'hint'});
          }
          this.el.nativeElement.querySelector(`th[mat-sort-header="${matSort.id}"] .mat-sort-header-arrow`).style.opacity = 0;
          matSort._sort.active = null;
          matSort._sort.direction = null;
        }
      })
      this.el.nativeElement.classList.add('sort-custom');
    }else{
      let target = this.sort.find(matSort => matSort.id === this.sitSortActive[0].columnName);
      let ele = (this.el.nativeElement as Element).querySelector(`th[mat-sort-header="${target.id}"]`);
      // case init back to page
      if (!target?._isSorted()) {
        this.sort.forEach((st) => {
          if (target.id !== st.id) {
            this.clearClassArrow((this.el.nativeElement as Element).querySelector(`th[mat-sort-header="${st.id}"]`));
          }
        })
        target._sort.active = null;
        target._sort.direction = null;
        this.clearClassArrow(ele);
        ele.classList.add(`display-sort-${this.sitSortActive[0].order.toLowerCase()}`);
        this.el.nativeElement.classList.add('sort-custom');
      }else {
        if (this.sitSortActive && this.sitSortActive[0].order.toLowerCase() !== target._arrowDirection) {
          if (target._isSorted()) {
            target._sort.active = null;
            target._sort.direction = null;
          }
          this.clearClassArrow(ele);
          ele.classList.add(`display-sort-${this.sitSortActive[0].order.toLowerCase()}`);
          this.el.nativeElement.classList.add('sort-custom');
        }
      }

    }
  }

  clearClassArrow(el: Element){
    // sort
    el?.classList.remove('display-sort-asc');
    el?.classList.remove('display-sort-desc');
  }
}
