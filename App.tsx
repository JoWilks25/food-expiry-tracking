import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  VirtualizedList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Button,
} from 'react-native';
import Item, { getItem, getItemCount } from './components/Items';
import ListHeaderComponent from './components/ListHeaderComponent';
import ModalView from './components/ModalView';
import storage, { saveToStorage, GroceryItemType } from './data/storage'

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

// Always increment lastId by 1 before using for new item, so keep as 0
const defaultStorageState = { lastId: 0, items: [] };
const defaultModalData = { isVisible: false, selectedId: null };

const App = () => {
  const [modalData, setModalData] = useState<modalDataType>(defaultModalData);
  const [sortBy, setSortBy] = useState<SortByType>({ sortName: 'expiryDate', sortOrder: 'desc' });
  const [groceryData, setGroceryData] = useState<GroceryItemType[]>()
  console.log("groceryData:", groceryData)
  const saveNewState = (key: string, data: {[key: string]: any }): void => {
    saveToStorage(key, data)
    setGroceryData(data.items)
    setModalData(defaultModalData)
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
      .then(ret => {
        console.log(ret);
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

  
  const sortedData = useMemo(() => { 
    if (groceryData) {
      const sorted = groceryData.sort((a, b): any => {
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
      });
      return sorted;
    }
    return []
  }, [groceryData, sortBy.sortName, sortBy.sortOrder]);

  const modalAction = (event: any, item?: GroceryItemType) => {
    // If a specific item has been provided then is edit mode
    setModalData({ ...modalData, isVisible: true, })
  }; 

  return (
    <SafeAreaView style={styles.container}>
      {/* MODAL VIEW */}
      <ModalView modalData={modalData} setModalData={setModalData} groceryData={groceryData} setGroceryData={setGroceryData} />

      {/* MAIN LIST VIEW */}
      <VirtualizedList
        initialNumToRender={4}
        renderItem={({ item }) => <Item setModalData={setModalData} modalData={modalData} item={item} />}
        keyExtractor={item => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        data={sortedData}
        ListHeaderComponent={<ListHeaderComponent sortBy={sortBy} setSortBy={setSortBy} />}
        stickyHeaderIndices={[0]}
      />
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
    //backgroundColor:'black'
  },
})

export default App;