import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  VirtualizedList,
  StyleSheet,
  StatusBar,
  Button,
  Alert,
  View,
  Text,
  Pressable,
} from 'react-native';
import moment from 'moment';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import { getAllScheduledNotificationsAsync } from 'expo-notifications';
import storage, { saveToStorage, GroceryItemType, loadFromStorage, ItemState } from '../utilities/storage'
import { askNotification } from '../utilities/notifications';
import Item, { getItem, getItemCount } from '../components/Items';
import ListHeaderComponent from '../components/ListHeaderComponent';
import ItemModalView from '../components/ItemModalView';
import FilterModalView from '../components/FilterModalView';
import FileSelectorComponent from '../components/FileSelectorComponent';
import DevToolView from '../components/DevToolModalView';


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
export type devToolDataType = {
  isVisible: boolean;
}

// Always increment lastId by 1 before using for new item, so keep as 0
export const defaultStorageState = { lastId: 0, items: [] };
const defaultModalData = { isVisible: false, selectedId: null };
const defaultFilterData = { isVisible: false, itemStates: [ItemState.ACTIVE] };
const defaultDevToolData = { isVisible: false };

const MainScreen = () => {
  const [groceryData, setGroceryData] = useState<GroceryItemType[]>();
  const [sortBy, setSortBy] = useState<SortByType>({ sortName: 'expiryDate', sortOrder: 'asc' });
  const [modalData, setModalData] = useState<modalDataType>(defaultModalData);
  const [filterModal, setFilterModal] = useState<filterModalType>(defaultFilterData);
  const [devToolData, setDevToolData] = useState<devToolDataType>(defaultDevToolData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Manage initial loading
  const saveNewState = async (key: string, data: { [key: string]: any }): Promise<void> => {// Cleanup
    saveToStorage(key, data)
    setGroceryData(data.items)
    setModalData(defaultModalData)
  }

  useEffect(() => {
    askNotification();
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
        .filter((item) => [...filterModal.itemStates].includes(item.itemState))
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
    console.log('scheduledNotifications no.', scheduledNotifications.length)
    scheduledNotifications.forEach((notification) => {
      console.log({
        id: notification.identifier,
        dateComponent: notification.trigger?.dateComponents,
        reminderType: notification.content.data.reminderType,
      })
    })
    // ---------------------
    setModalData({ ...modalData, isVisible: true, })
  };

  // Functions for Item Actions
  const handleStateChange = (itemId: number, newItemState: ItemState): void => {
    if (!itemId) { Alert.alert("Unable to delete") }
    if (itemId) {
      loadFromStorage('groceryData')
        .then((groceryDataObject: any) => {
          let newGroceryData = { ...groceryDataObject }
          const todaysDate = moment().format('YYYY-MM-DD');
          const foundIndex = groceryDataObject?.items?.findIndex((groceryDatum: GroceryItemType) => groceryDatum.id === itemId)
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

      <DevToolView
        saveNewState={saveNewState}
        devToolData={devToolData}
        setDevToolData={setDevToolData}
      />

      {/* MAIN LIST VIEW */}
      <View style={styles.listContainer}>
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
        {isLoading && <Text>...loading</Text>}
      </View>
      <View style={styles.buttonsWrapper}>
        <FileSelectorComponent setGroceryData={setGroceryData} setIsLoading={setIsLoading} />
        <Button
          title="Dev Tools"
          onPress={() => {
            setDevToolData({ isVisible: true, })
          }}
        />
        <MatIcon
          name="add-circle"
          onPress={modalAction}
          size={50}
          color="#3b5998"
        />
      </View>
    </SafeAreaView>
  );
};

const styles: any = StyleSheet.create({
  // LIST STYLES
  container: {
    height: '100%',
    marginTop: StatusBar.currentHeight,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  listContainer: {
    height: '90%',
    marginTop: -150,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  buttonsWrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
  },
})

export default MainScreen;