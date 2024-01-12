import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  VirtualizedList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Button,
  Alert,
  View,
} from 'react-native';
import moment from 'moment';
import Item, { getItem, getItemCount } from '../components/Items';
import ListHeaderComponent from '../components/ListHeaderComponent';
import ItemModalView from '../components/ItemModalView';
import storage, { saveToStorage, GroceryItemType, loadFromStorage, ItemState } from '../utilities/storage'
import FilterModalView from '../components/FilterModalView';
import { cancelAllScheduledNotificationsAsync, getAllScheduledNotificationsAsync } from 'expo-notifications';
import FileSelectorComponent from '../components/FileSelectorComponent';


type sortNameType = 'name' | 'expiryDate';
type sortOrderType = 'asc' | 'desc';
export type SortByType = {
  sortName: sortNameType;
  sortOrder: sortOrderType;
};
export type modalDataType = {
  isVisible: boolean;
  selectedId: number | null 
}
export type filterModalType = {
  isVisible: boolean;
  itemStates: ItemState[];
}


// Always increment lastId by 1 before using for new item, so keep as 0
const defaultStorageState = { lastId: 0, items: [] };
const defaultModalData = { isVisible: false, selectedId: null };
const defaultFilterData = { isVisible: false, itemStates: [ItemState.ACTIVE] };

const MainScreen = () => {
  const [groceryData, setGroceryData] = useState<GroceryItemType[]>();
  const [sortBy, setSortBy] = useState<SortByType>({ sortName: 'expiryDate', sortOrder: 'desc' });
  const [modalData, setModalData] = useState<modalDataType>(defaultModalData);
  const [filterModal, setFilterModal] = useState<filterModalType>(defaultFilterData);
  
  // Manage initial loading
  const saveNewState = async (key: string, data: {[key: string]: any }): Promise<void> => {// Cleanup
    saveToStorage(key, data)
    setGroceryData(data.items)
    setModalData(defaultModalData)
    await cancelAllScheduledNotificationsAsync()
  }
  
  useEffect(() => {
    // Check for existing data
    storage.load({
        key: 'groceryData',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {
          },
          someFlag: true
        }
      })
      .then(groceryData => {
        setGroceryData(groceryData.items)
      })
      .catch(err => {
        console.info(err.message);
        switch (err.name) {
          case 'NotFoundError':
            // Create boilerplate data
            saveNewState('groceryData', defaultStorageState)
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });

  }, [])

  // Functions for Header Components
  const sortedData = useMemo(() => { 
    if (groceryData) {
      const sorted = groceryData
        .filter((item)=> [...filterModal.itemStates].includes(item.itemState))
        .sort((a, b): any => {
          if (sortBy.sortName === 'expiryDate') {
            if (sortBy.sortOrder === 'asc') {
              return new Date(a[sortBy.sortName]).getTime() - new Date(b[sortBy.sortName]).getTime();
            } else {
              return new Date(b[sortBy.sortName]).getTime() - new Date(a[sortBy.sortName]).getTime();
            }
          }
          if (sortBy.sortName === 'name') {
            if (sortBy.sortOrder === 'asc') {
              return a[sortBy.sortName].localeCompare(b[sortBy.sortName]);
            } else {
              return b[sortBy.sortName].localeCompare(a[sortBy.sortName]);
            }
          }
        })
      return sorted;
    }
    return []
  }, [groceryData, sortBy.sortName, sortBy.sortOrder, filterModal.itemStates]);

  // Functions for Modal
  const modalAction = async (event: any, item?: GroceryItemType) => {
    // -- TODO delete ------
    const scheduledNotifications = await getAllScheduledNotificationsAsync();
    scheduledNotifications.forEach((notification) => {
      console.log({
        id: notification.identifier,
        dateComponent: notification.trigger?.dateComponents,
      })
    })
    // ---------------------
    setModalData({ ...modalData, isVisible: true, })
  }; 

  // Functions for Item Actions
  const handleStateChange = (itemId: number, newItemState: ItemState): void => {
    if (!itemId) { Alert.alert("Unable to delete")}
    if (itemId) {
      loadFromStorage('groceryData')
        .then((groceryDataObject: any) => {
          let newGroceryData = {...groceryDataObject}
          const todaysDate = moment().format('YYYY-MM-DD');
          const foundIndex = groceryDataObject?.items?.findIndex((groceryDatum: GroceryItemType) => groceryDatum.id === itemId)
          console.log('foundIndex', foundIndex)
          if (foundIndex < 0) {
            Alert.alert("Unable to find item")
            return
          }
          Object.assign(groceryDataObject.items[foundIndex], {
            lastUpdateDate: todaysDate,
            itemState: newItemState,
          })
          saveToStorage('groceryData', newGroceryData)
          setGroceryData(newGroceryData.items)
        })
        .catch((error: any) => {
          console.log('error', error)
        });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* MODAL VIEWS */}
      <ItemModalView
        modalData={modalData}
        setModalData={setModalData}
        groceryData={groceryData}
        setGroceryData={setGroceryData}
      />
      
      <FilterModalView
        filterModal={filterModal}
        setFilterModal={setFilterModal}
      />

      {/* MAIN LIST VIEW */}
      <VirtualizedList
        initialNumToRender={4}
        renderItem={({ item }) => 
          <Item
            setModalData={setModalData}
            item={item}
            handleStateChange={handleStateChange}
            setFilterModal={setFilterModal}
          />
        }
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        data={sortedData}
        ListHeaderComponent={
          <ListHeaderComponent
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterModal={filterModal}
            setFilterModal={setFilterModal}
          />
        }
        stickyHeaderIndices={[0]}
      />
      <View style={styles.buttonsWrapper}>
        {/* <Button
          title={"Add from Receipt"}
          onPress={() => {
            
          }}
        /> */}
        <FileSelectorComponent/>
        <Button
          title={"Reset Storage"}
          onPress={() => {
            storage.remove({
              key: 'groceryData',
            }).then(() => {
              saveNewState('groceryData', defaultStorageState)
            });
          }}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={modalAction}
        style={styles.touchableOpacityStyle}>
        <Image
          // FAB using TouchableOpacity with an image
          // For online image
          source={{
            uri:
              'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
          }}
          // For local image
          //source={require('./images/float-add-icon.png')}
          style={styles.floatingButtonStyle}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles: any = StyleSheet.create({
  // LIST STYLES
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
  buttonsWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: 155,
    height: 50,
  },
})

export default MainScreen;