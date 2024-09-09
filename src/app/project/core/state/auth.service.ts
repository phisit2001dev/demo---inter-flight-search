import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  constructor(private authStore: AuthStore) {}

  setAuthState(language: string) {
    this.authStore.update(
      (state) =>
        (state = {
          language: language
        })
    );
  }
}
