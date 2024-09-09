import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppErrorHandler } from '@app/common/errors/app-error-handler';
import { ErrorHttpInterceptor } from '@app/common/interceptors/http-error-interceptor';
import { HttpReqInterceptor } from '@app/common/interceptors/http-req-interceptor';
import { AlertDialogComponent } from '@app/project/shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '@evn/environment';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SitBtnScrollTopComponent } from './../shared/components/sit-btn-scroll-top/sit-btn-scroll-top.component';
import { OwnTranslateLoader } from './../shared/own-translate-loader';
import { DialogUpdateVersionComponent } from './components/dialog-update-version/dialog-update-version.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { MenuFullComponent } from './components/menu-full/menu-full.component';
import { GenerateBsColPipe } from './components/menu-full/pipes/generate-bs-col.pipe';
import { IconMenuPipe } from './components/menu-full/pipes/icon-menu.pipe';
import { StyleMenuPipe } from './components/menu-full/pipes/style-menu.pipe';
import { CoreRoutingModule } from './core-routing.module';
import { SitSpinnerModule } from './modules/spinner/sit-spinner.module';
import { SessionStorageService } from './services/session-storage.service';

export function createTranslateLoader(http: HttpClient) {
  return new OwnTranslateLoader(http, [
    { prefix: 'assets/bundle/core/', suffix: '.json' }
  ]);
}

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    MainNavComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    SitBtnScrollTopComponent,
    MenuFullComponent,
    GenerateBsColPipe,
    StyleMenuPipe,
    IconMenuPipe,
    DialogUpdateVersionComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    CoreRoutingModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    TranslateModule.forChild({
      loader: [
        {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      ],
      isolate: true,
    }),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    MatDialogModule,
    SitSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    MatTreeModule,
    MatDividerModule
  ],
  exports: [
    RouterModule,
    SitSpinnerModule,
    MatSnackBarModule,
    MainNavComponent,
    ConfirmDialogComponent,
    AlertDialogComponent,
    SitBtnScrollTopComponent
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpReqInterceptor,
      multi: true,
      deps: [SessionStorageService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHttpInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule { }
