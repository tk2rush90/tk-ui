import {Observable, from} from 'rxjs';

export interface IndexedDbConfig {
  // Db name.
  name: string;
  // Db version.
  version?: number;
  // Store configs.
  stores: IndexedDbStoreConfig[];
}

export interface IndexedDbStoreConfig {
  // Store name.
  name: string;
  // Key path for store.
  keyPath?: string | string[];
  // Auto increment state.
  autoIncrement?: boolean;
  // Indices for store.
  indices?: IndexedDbStoreIndexConfig[];
  // Upgrade handler.
  // Use this callback function to modify the data when db needs upgrade.
  onUpgrade?: <T>(data: T[]) => T[];
}

export interface IndexedDbStoreIndexConfig {
  // Index name.
  name: string;
  // Key path for index.
  keyPath: string | string[];
  // See: https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex/multiEntry
  multiEntry?: boolean;
  // Unique state.
  unique?: boolean;
}

export class IndexedDbUtil {
  /**
   * Connect to indexed db with database name.
   * It always returns the latest version of db and doesn't handle any upgrades.
   * @param name database name
   */
  static connect(name: string): Observable<IDBDatabase> {
    const request: IDBOpenDBRequest = indexedDB.open(name);
    const promise = new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return from(promise);
  }

  /**
   * Initialize the db with configuration.
   * When the upgrade is needed, it will upgrade your db automatically.
   * @param config configuration
   */
  static initDb(config: IndexedDbConfig): Observable<IDBDatabase> {
    const request: IDBOpenDBRequest = indexedDB.open(config.name, config.version);
    const promise = new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);

      // Handle upgrade
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this._upgradeDb(event, request.result, config)
          .subscribe({
            next: () => {
              resolve(request.result);
            },
            error: err => {
              reject(err);
            },
          });
      };
    });

    return from(promise);
  }

  /**
   * Upgrade db with configuration when needed.
   * @param event version change event
   * @param db indexed db
   * @param config db configuration
   */
  private static _upgradeDb(event: IDBVersionChangeEvent, db: IDBDatabase, config: IndexedDbConfig): Observable<void> {
    const storeMap = this._getDomStringListAsMap(db.objectStoreNames);

    const promise = new Promise<void>((resolve, reject) => {
      config.stores.map(storeConfig => {
        const {name} = storeConfig;

        // Delete store to update from map.
        // The unused stores will be deleted at last.
        if (storeMap[name]) {
          delete storeMap[name];

          const previousStore = (event.target as IDBOpenDBRequest).transaction?.objectStore(name);

          if (previousStore) {
            // Get all data to restore after re-creating store.
            this._getAllPreviousData(previousStore)
              .subscribe({
                next: res => {
                  // Delete existing one to update from here after saving previous data.
                  db.deleteObjectStore(name);

                  // If there is `onUpgrade()` callback,
                  // call this callback to modify previous data according to new version.
                  if (storeConfig.onUpgrade) {
                    res = storeConfig.onUpgrade(res);
                  }

                  // Create new store.
                  const newStore = this.createStore(db, storeConfig);

                  // Restore previous data.
                  this._restoreAllData(newStore, res)
                    .subscribe({
                      next: () => {
                        this._removeUnusedStores(db, storeMap);
                        resolve();
                      },
                      error: err => reject(err),
                    });
                },
                error: err => reject(err),
              });
          } else {
            resolve();
          }
        } else {
          this.createStore(db, storeConfig);
          resolve();
        }
      });
    });

    return from(promise);
  }

  /**
   * Get all previous data to restore after re-creating object store.
   * @param store previous object store.
   */
  private static _getAllPreviousData(store: IDBObjectStore): Observable<any[]> {
    const request = store.getAll();
    const promise = new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return from(promise);
  }

  /**
   * Restore previous data to newly created object store.
   * @param store new object store
   * @param data data to restore
   */
  private static _restoreAllData(store: IDBObjectStore, data: any[]): Observable<void[]> {
    const promises = data.map(item => {
      return new Promise<void>((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return from(Promise.all(promises));
  }

  /**
   * Create new object store and return it.
   * @param db database
   * @param config store create configuration
   */
  static createStore(db: IDBDatabase, config: IndexedDbStoreConfig): IDBObjectStore {
    const {name, keyPath, autoIncrement, indices} = config;

    const store = db.createObjectStore(name, {
      keyPath: keyPath,
      autoIncrement: autoIncrement,
    });

    this._createStoreIndices(store, indices);

    return store;
  }

  /**
   * Get all data from the object store.
   * Returning data will be an array.
   * @param db database
   * @param storeName store name
   * @param query db query key
   */
  static getAll<T>(db: IDBDatabase, storeName: string, query: IDBValidKey | IDBKeyRange | null = null): Observable<T[]> {
    const transaction = db.transaction([storeName], 'readonly');

    return this.getAllWithTransaction(transaction, storeName, query);
  }

  /**
   * Get a single data from the object store.
   * @param db database
   * @param storeName store name
   * @param query db query key
   */
  static get<T>(db: IDBDatabase, storeName: string, query: IDBValidKey | IDBKeyRange): Observable<T> {
    const transaction = db.transaction([storeName], 'readonly');

    return this.getWithTransaction(transaction, storeName, query);
  }

  /**
   * Add new data to object store
   * @param db database
   * @param storeName store name
   * @param data single data or data list to add
   */
  static add<T>(db: IDBDatabase, storeName: string, data: T | T[]): Observable<IDBValidKey[]> {
    data = data instanceof Array ? data : [data];

    const transaction = db.transaction([storeName], 'readwrite');

    return this.addWithTransaction(transaction, storeName, data);
  }

  /**
   * Delete the data from the object store.
   * @param db database
   * @param storeName store name
   * @param query db query key
   */
  static delete(db: IDBDatabase, storeName: string, query: IDBValidKey | IDBKeyRange): Observable<void> {
    const transaction = db.transaction([storeName], 'readwrite');

    return this.deleteWithTransaction(transaction, storeName, query);
  }

  /**
   * Update the data from the object store.
   * @param db database
   * @param storeName store name
   * @param data data to update
   * @param query db query key
   */
  static put<T>(db: IDBDatabase, storeName: string, data: T, query?: IDBValidKey): Observable<void> {
    const transaction = db.transaction([storeName], 'readwrite');

    return this.putWithTransaction(transaction, storeName, data, query);
  }

  /**
   * Get all data from the object store.
   * Returning data will be an array.
   * @param transaction transaction
   * @param storeName store name
   * @param query db query key
   */
  static getAllWithTransaction<T>(transaction: IDBTransaction, storeName: string, query: IDBValidKey | IDBKeyRange | null = null): Observable<T[]> {
    const store = transaction.objectStore(storeName);
    const request = store.getAll(query);
    const promise = new Promise<T[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return from(promise);
  }

  /**
   * Get a single data from the object store.
   * @param transaction transaction
   * @param storeName store name
   * @param query db query key
   */
  static getWithTransaction<T>(transaction: IDBTransaction, storeName: string, query: IDBValidKey | IDBKeyRange): Observable<T> {
    const store = transaction.objectStore(storeName);
    const request = store.get(query);
    const promise = new Promise<T>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return from(promise);
  }

  /**
   * Add new data to object store
   * @param transaction transaction
   * @param storeName store name
   * @param data single data or data list to add
   */
  static addWithTransaction<T>(transaction: IDBTransaction, storeName: string, data: T | T[]): Observable<IDBValidKey[]> {
    data = data instanceof Array ? data : [data];

    const store = transaction.objectStore(storeName);
    const promises = data.map(item => {
      return new Promise<IDBValidKey>((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    });

    return from(Promise.all(promises));
  }

  /**
   * Delete the data from the object store.
   * @param transaction transaction
   * @param storeName store name
   * @param query db query key
   */
  static deleteWithTransaction(transaction: IDBTransaction, storeName: string, query: IDBValidKey | IDBKeyRange): Observable<void> {
    const store = transaction.objectStore(storeName);
    const request = store.delete(query);
    const promise = new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return from(promise);
  }

  /**
   * Update the data from the object store.
   * @param transaction transaction
   * @param storeName store name
   * @param data data to update
   * @param query db query key
   */
  static putWithTransaction<T>(transaction: IDBTransaction, storeName: string, data: T, query?: IDBValidKey): Observable<void> {
    const store = transaction.objectStore(storeName);
    const request = store.put(data, query);
    const promise = new Promise<void>((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return from(promise);
  }

  /**
   * Remove unused stores from indexed db.
   * @param db database
   * @param map unused index name map
   */
  private static _removeUnusedStores(db: IDBDatabase, map: {[k: string]: boolean}): void {
    Object.keys(map).forEach(key => {
      db.deleteObjectStore(key);
    });
  }

  /**
   * Create indices for object store.
   * @param store object store
   * @param indices store index configurations
   */
  private static _createStoreIndices(store: IDBObjectStore, indices: IndexedDbStoreIndexConfig[] = []): void {
    const indexMap = this._getDomStringListAsMap(store.indexNames);

    indices.forEach(indexConfig => {
      const {name, keyPath, unique, multiEntry} = indexConfig;

      // Delete index to update from map.
      // The unused indices will be deleted at last.
      if (indexMap[name]) {
        delete indexMap[name];

        // Delete previous index.
        store.deleteIndex(name);
      }

      store.createIndex(name, keyPath, {
        unique: unique || false,
        multiEntry: multiEntry || false,
      });
    });

    // Remove remaining indices those are not using.
    this._removeUnusedIndices(store, indexMap);
  }

  /**
   * Remove unused indices from object store.
   * @param store object store
   * @param map unused index name map
   */
  private static _removeUnusedIndices(store: IDBObjectStore, map: {[k: string]: boolean}): void {
    Object.keys(map).forEach(key => {
      store.deleteIndex(key);
    });
  }

  /**
   * Get the dom string list as map.
   * @param list dom string list to transform
   */
  private static _getDomStringListAsMap(list: DOMStringList): {[k: string]: boolean} {
    const map: {[k: string]: boolean} = {};
    const length = list.length;

    for (let i = 0; i < length; i++) {
      const index = list.item(i);

      if (index) {
        map[index] = true;
      }
    }

    return map;
  }
}
