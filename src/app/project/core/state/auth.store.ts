import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { SessionStorageService } from '../services/session-storage.service';
export interface AuthState {
  language: string;
}

export function createInitialState(profile: string): AuthState {
  return {
    language: profile ? JSON.parse(profile).language : null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<AuthState> {
  constructor(sessionStorageService: SessionStorageService) {
    super(createInitialState(sessionStorageService.getProfile()));
  }
}
