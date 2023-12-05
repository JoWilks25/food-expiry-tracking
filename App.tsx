import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  VirtualizedList,
  StyleSheet,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import dummyData, { GroceryItemType } from './dummyData';

type ItemData = {
  id: string;
  title: string;
  date: string;
};

const getItem = (data: GroceryItemType, index: number): unknown => {
  return {
    tempId: index,
    ...data[index]
  }
};

const getItemCount = (_data: unknown) => _data.length;

type ItemProps = {
  title: string;
  date: string;
};

const Item = ({ title, date }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.date}>{date}</Text>
    <Text style={styles.title}>{title}</Text>
    <Button title="Edit" onPress={() => console.log(`Clicked ${title}`)} />
  </View>
);

const ListHeaderComponent = () => {
  return (
    <View style={styles.headerView}>
      <Icon.Button
        name={true ? 'sort-amount-asc' : 'sort-amount-desc'}
        // backgroundColor="#3b5998"
        onPress={() => console.log('sort by date')}
      >
       Expiry Date
      </Icon.Button>
      <Icon.Button
        name={true ? 'sort-alpha-asc' : 'sort-alpha-desc'}
        onPress={() => console.log('sort by alphabetical')}
      >
        Alphabetical
      </Icon.Button>
    </View>
  )
}

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const clickHandler = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* MODAL VIEW */}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>


      {/* MAIN LIST VIEW */}
      <VirtualizedList
        initialNumToRender={4}
        renderItem={({ item }) => <Item title={item.name} date={item.expiryDate} />}
        keyExtractor={item => item.tempId}
        getItemCount={getItemCount}
        getItem={getItem}
        data={dummyData}
        ListHeaderComponent={<ListHeaderComponent/>}
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

const styles = StyleSheet.create({
  // LIST STYLES
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
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
  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 4,
  },
  // MODAL STYLES
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;