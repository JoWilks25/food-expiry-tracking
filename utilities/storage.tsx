import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum ItemState {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
  EATEN = 'EATEN',
  WASTED = 'WASTED',
  EXPIRED_EARLY = 'EXPIRED_EARLY',
}



export interface GroceryItemType {
  id: number;
  name: string;
  expiryDate: string;
  reminderDate: string;
  addDate: string;
  lastUpdateDate: string | null; 
  units: number; // Number of units
  itemState: ItemState;
  // scheduleIds: string[];
  // quantity: number;
  // quantityMeasure: string;
  // price: number;
  // priceType: string;
}

const storage = new Storage({
  // maximum capacity, default 1000 key-ids
  size: 1000,

  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage, // for web: window.localStorage

  // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
  // can be null, which means never expire.
  defaultExpires: 1000 * 3600 * 24,

  // cache data in the memory. default is true.
  enableCache: true,

  // if data was not found in storage or expired data was found,
  // the corresponding sync method will be invoked returning
  // the latest data.
  sync: {
    // we'll talk about the details later.
  }
});

export const saveToStorage = (key: string, data: {[key: string]: any }): void => {
  storage.save({
    key, // Note: Do not use underscore("_") in key!
    data,
    expires: null,
  });
}

export const loadFromStorage = (key: string): any => {
  return storage.load({
    key,
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  // .then(ret => {
  //   console.log(ret);
  //   return ret;
  // })
  // .catch(err => {
  //   console.info(err.message);
  //   switch (err.name) {
  //     // TODO
  //     case 'NotFoundError':
  //       break;
  //     case 'ExpiredError':
  //       break;
  //   }
  // });
}

export default storage;