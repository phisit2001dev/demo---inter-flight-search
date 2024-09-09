import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error) {
    console.error('AppErrorHandler', error);
  }
}
