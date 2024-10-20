import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  deletedStorageKey(key: string): void {
    localStorage.removeItem(key);
  }

  getStorageKey(key: string): string | null {
    return localStorage.getItem(key);
  }

  setStorageKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
