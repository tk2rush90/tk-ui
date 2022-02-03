import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  /**
   * Set data to local storage
   * @param key key
   * @param data data
   */
  setToLocal<T>(key: string, data: T): void {
    const json = JSON.stringify(data);

    localStorage.setItem(key, json);
  }

  /**
   * Get data from local storage
   * @param key key
   */
  getFromLocal<T>(key: string): T | undefined {
    const json = localStorage.getItem(key);

    if (json) {
      return JSON.parse(json) as T;
    } else {
      return;
    }
  }

  /**
   * Set data to session storage
   * @param key key
   * @param data data
   */
  setToSession<T>(key: string, data: T): void {
    const json = JSON.stringify(data);

    sessionStorage.setItem(key, json);
  }

  /**
   * Get data from session storage
   * @param key key
   */
  getFromSession<T>(key: string): T | undefined {
    const json = sessionStorage.getItem(key);

    if (json) {
      return JSON.parse(json) as T;
    } else {
      return;
    }
  }
}
