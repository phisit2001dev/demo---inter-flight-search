import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { SpinnerService } from './spinner.service';

enum snackBarType {
  info = 'info-snack',
  success = 'success-snack',
  warn = 'warn-snack',
  error = 'danger-snack',
}

@Injectable({
  providedIn: 'root'
})

export class SnackbarService {
  constructor(private snackBar: MatSnackBar, private spinnerService: SpinnerService) {}

  getSnackbar() {
    return this.snackBar;
  }

  getInfoConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.duration = 3000;
    config.direction = 'ltr';
    config.panelClass = [snackBarType.info];
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    return config;
  }

  getSuccessConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    config.duration = 5500;
    config.direction = 'ltr';
    config.panelClass = [snackBarType.success];
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    return config;
  }

  getErrorConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    //config.duration = 5000;
    config.direction = 'ltr';
    config.panelClass = [snackBarType.error];
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    return config;
  }

  getWarnConfig(): MatSnackBarConfig {
    const config = new MatSnackBarConfig();
    // config.duration = 3000;
    config.direction = 'ltr';
    config.panelClass = [snackBarType.warn];
    config.verticalPosition = 'top';
    config.horizontalPosition = 'center';
    return config;
  }

  openSnackBar(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    if (!config) {
      config = this.getInfoConfig();
    }
    const snackBarRef = this.snackBar.open(message, action, config);
    return snackBarRef;
  }

  open(message: string, type: 'W' | 'E' | 'S' | string, disableHideSpinner?: boolean): MatSnackBarRef<SimpleSnackBar> {
    let config: MatSnackBarConfig;

    if (!disableHideSpinner) {
      // ปิด spinner เอาไว้ก่อน return จะไม่สามารถปิด spinner ได้
      this.spinnerService.hide();
    }

    if (type === 'W') {
      config = this.getWarnConfig();
      return this.snackBar.open(message, 'X', config);
    } else if (type === 'E') {
      config = this.getErrorConfig();
      return this.snackBar.open(message, 'X', config);
    } else if (type === 'S') {
      config = this.getSuccessConfig();
    } else {
      config = this.getInfoConfig();
    }

    return this.snackBar.open(message, undefined, config);
  }

  // 10/09/2021 thanat.s 2020CAAT-2484 - เพิ่มการเปิด snackbar with class
  openSnackBarErrorWithClass(message: string, className?: string): MatSnackBarRef<SimpleSnackBar> {
    let config: MatSnackBarConfig = this.getErrorConfig();
    config = this.addPanelClass(config, className)
    const snackBarRef = this.snackBar.open(message, 'X', config);
    return snackBarRef;
  }

  // 10/09/2021 thanat.s 2020CAAT-2484 - add class ให้ snackbar
  private addPanelClass(snackBarConfig: MatSnackBarConfig, className?: string){
    const config: any = snackBarConfig;
    // check type string
    if (typeof(config.panelClass) === 'string') {
      config.panelClass = [config.panelClass, className];
    } else {
    // check type array
      config.panelClass ? config.panelClass.push(className) :
      config.panelClass = className;
    }
    return (config as MatSnackBarConfig);
  }

  dismiss(ignoreType: 'W' | 'E' | 'S' = 'S'){
    let snackBar = this.getSnackbar()._openedSnackBarRef;
    if (snackBar?.containerInstance.snackBarConfig.panelClass[0] !== this.getSnackBarClass(ignoreType)) {
      this.getSnackbar().dismiss();
    }
  }

  getSnackBarClass(type: 'W' | 'E' | 'S') {
    switch (type) {
      case 'S':
        return snackBarType.success;
      case 'W':
        return snackBarType.warn;
      case 'E':
        return snackBarType.error;
    }
  }

}
