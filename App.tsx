import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  VirtualizedList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Item, { getItem, getItemCount } from './components/Items';
import ListHeaderComponent from './components/ListHeaderComponent';
import ModalView from './components/ModalView';
import dummyData from './dummyData';
import { styles } from './styles/styles';

type sortNameType = 'name' | 'expiryDate';
type sortOrderType = 'asc' | 'desc';
export type SortByType = {
  sortName: sortNameType;
  sortOrder: sortOrderType;
};



const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortByType>({ sortName: 'expiryDate', sortOrder: 'desc' });

  const sortedData = useMemo(() => { 
    if (dummyData) {
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
      <ModalView modalVisible={modalVisible} setModalVisible={setModalVisible} />

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

export default App;