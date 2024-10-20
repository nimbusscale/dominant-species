import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  deletedStorageKey(key: string): void {
    localStorage.removeItem(key);
  }

  getStorageKey(key: string): string {
    const item = localStorage.getItem(key);
    if (item === null) {
      throw new Error(`Could not get storage key: ${key}`);
    }
    return item;
  }

  setStorageKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
}
