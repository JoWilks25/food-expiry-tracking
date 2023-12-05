import React, { useState } from 'react';
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
import { styles } from './styles';


const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

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
        data={dummyData}
        ListHeaderComponent={<ListHeaderComponent />}
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