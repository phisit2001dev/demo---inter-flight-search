import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { TimezoneService } from '@app/project/core/services/timezone.service';
import { environment } from '@evn/environment';
import { Subject, takeUntil } from 'rxjs';
import { SessionStorageService } from '../../services/session-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { SpinnerService } from './../../services/spinner.service';
import { MainNavService } from '../../services/main-nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy{

  constructor(
    private snackbarService: SnackbarService,
    private spiner: SpinnerService,
    private http: HttpClient,
    public timeZoneService: TimezoneService,
    public ssessionStorage: SessionStorageService,
    private navService: MainNavService,
  ){}

  timeZone = null;
  private destroy$ = new Subject<any>;

  ngOnInit(): void {
    this.inittimeZone();
    this.navService.currentSys = '';
  }

  ngAfterViewInit(): void {
    this.spiner.hide();
  }

  ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  inittimeZone(){
    this.timeZoneService.change().pipe(takeUntil(this.destroy$)).subscribe((change => {
      this.timeZone = change;
    }))
  }
}

/** ใช้ขั่วคราว */
export interface TemporaryMenu {
  name: string;
  path?: string;
  status?: string;
}
