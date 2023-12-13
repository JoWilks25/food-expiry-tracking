import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  VirtualizedList,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Item, { getItem, getItemCount } from './components/Items';
import ListHeaderComponent from './components/ListHeaderComponent';
import ModalView from './components/ModalView';
import dummyData, { GroceryItemType } from './data/dummyData';
import storage, { saveToStorage } from './data/storage'

type sortNameType = 'name' | 'expiryDate';
type sortOrderType = 'asc' | 'desc';
export type SortByType = {
  sortName: sortNameType;
  sortOrder: sortOrderType;
};

const defaultStorageState = { items: [...dummyData] };

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortByType>({ sortName: 'expiryDate', sortOrder: 'desc' });
  const [groceryData, setGroceryData] = useState<GroceryItemType[]>()

  const saveNewState = (key: string, data: {[key: string]: any }): void => {
    saveToStorage(key, data)
    setGroceryData(data.items)
  }
  
  useEffect(() => {
    // Check for existing data
    storage.remove({
      key: 'groceryData'
    });
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
      const sorted = dummyData.sort((a, b): any => {
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
  }, [sortBy.sortName, sortBy.sortOrder]);

  const clickHandler = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* MODAL VIEW */}
      <ModalView modalVisible={modalVisible} setModalVisible={setModalVisible} groceryData={groceryData} setGroceryData={setGroceryData} />

      {/* MAIN LIST VIEW */}
      <VirtualizedList
        initialNumToRender={4}
        renderItem={({ item }) => <Item title={item.name} date={item.expiryDate} />}
        keyExtractor={item => item.tempId}
        getItemCount={getItemCount}
        getItem={getItem}
        data={sortedData}
        ListHeaderComponent={<ListHeaderComponent sortBy={sortBy} setSortBy={setSortBy} />}
        stickyHeaderIndices={[0]}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={clickHandler}
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