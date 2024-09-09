import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-inter-flight-search-table',
  templateUrl: './inter-flight-search-table.component.html',
  styleUrls: ['./inter-flight-search-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterFlightSearchTableComponent extends AbstractComponent implements OnInit{
  @Input() selection:SelectionModel<any>;
  @Input() dataSource$: Observable<any>;
  @Input() headerSorts: any;


  @Input() linePerPage: string;
  @Input() pageIndex: number;
 
  @Input() permission: Permission;

  @Output() sortChange = new EventEmitter();
  @Output() pageEvent = new EventEmitter();
  
  @Output() export = new EventEmitter();
  dataSource;
  dataLength = 0;
  pageSize;
  displayPageIndex = 0;
  displayedColumns: string[] = ['no', 'checkbox', 'departureDateTime', 'arrivalDateTime', 'serviceNumber' , 'route' , 'direction' , 'expectedPax' , 'expectedCrew' , 'expactedTotal' , 'cancelledPax' , 'cancelledCrew' , 'cancelledTotal' , 'scheduleType'];
 


  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    public spinner: SpinnerService,
    public router : Router,
    public cdf: ChangeDetectorRef){
    super(snackbarService, dialog, spinner, null, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
   this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe(resp =>{
    this.displayPageIndex = this.pageIndex + 1
  
    if(resp){
      this.dataSource = resp.data
      this.dataLength = this.dataSource?.totalResult;
      this.pageSize = this.linePerPage;
    }

    else{
      this.dataSource = null
    }
    
    this.cdf.markForCheck();
   })
  
  }

 PageChange(e:PageEvent){
  if(this.validatePaginator(e.pageIndex, this.linePerPage, this.dataLength)){
    if(e.previousPageIndex === null){
      if(e.pageIndex === 0){
        return false
      }

      this.displayPageIndex = e.pageIndex
      let objVal:PageEvent = e;
      objVal.pageIndex = e.pageIndex -1
      this.pageEvent.emit(objVal);
    }
    else{
      this.displayPageIndex +=(e.pageIndex - e.previousPageIndex);
      this.pageEvent.emit(e);
    }
  }
 }
  

 btnExport(){
  this.export.emit('');
 }

 masterToggle(){
  if(this.isAllSelected()){
    this.selection.clear();
  }
  else{
    this.dataSource?.listResult?.forEach(row => this.selection.select(row));
  }
 }

 isAllSelected() {
  const numSelected = this.selection.selected?.length;
  const numRows = this.dataSource?.listResult.length;

  return numSelected === numRows;
}

 childToggle(element: any){
  this.selection.toggle(element);
 }



}
  

