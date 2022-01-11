import {IndexedDbConfig} from '@tk-ui/utils/indexed-db.util';
import {FirstDbService} from '../services/first-db.service';
import {FirstStoreService} from '../services/first-store.service';
import {SecondStoreService} from '../services/second-store.service';
import {RandomUtil} from '@tk-ui/utils/random.util';

export const DbConfig: IndexedDbConfig = {
  name: FirstDbService.dbName,
  version: 16,
  stores: [
    {
      name: FirstStoreService.storeName,
      keyPath: 'id',
      indices: [
        {
          name: 'uniqueId',
          keyPath: 'id',
          unique: true,
        },
        {
          name: 'userName',
          keyPath: 'name',
        },
      ],
      onUpgrade: data => {
        return data.map(item => {
          return {
            ...item,
            name: RandomUtil.key(),
          };
        });
      },
    },
    {
      name: SecondStoreService.storeName,
      keyPath: 'id',
    },
  ],
};
