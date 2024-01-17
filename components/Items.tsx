import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { GroceryItemType, ItemState } from '../utilities/storage';
import { modalDataType } from '../screens/MainScreen';

interface ItemProps {
  item: GroceryItemType
  modalData: modalDataType;
  setModalData: (modalData: modalDataType) => void;
  handleStateChange: (itemId: number, itemState: ItemState) => void;
}
export const getItem = (data: GroceryItemType, index: number): ItemProps => data[index];

export const getItemCount = (data: ItemProps): number => data.length;



const Item = ({ item, setModalData, handleStateChange }: ItemProps) => (
  <View style={styles.column}>
    <View style={styles.row}>
      <View style={styles.leftColumn}>
        <Text style={styles.date}>{item?.expiryDate}</Text>
      </View>
      <View style={styles.rightColumn}>
        <FAIcon
          name="edit"
          color={item?.itemState !== ItemState.ACTIVE ? "#D3D3D3" : "#3B67CE"}
          size={25}
          disabled={item?.itemState !== ItemState.ACTIVE}
          onPress={() => setModalData({ isVisible: true, selectedId: item?.id })}
        />
        <EntypoIcon
          name="circle-with-cross"
          color={item?.itemState !== ItemState.ACTIVE ? "#D3D3D3" : "red"}
          size={25}
          disabled={item?.itemState !== ItemState.ACTIVE}
          onPress={() => handleStateChange(item?.id, ItemState.DELETED)}
        />
      </View>
    </View>
    <View style={styles.row}>
        <View style={styles.leftColumn}>
          <Text style={styles.name}>x{item?.units} {item?.name}</Text>
          <Text style={styles.name}>{item?.itemState !== ItemState.ACTIVE ? item?.itemState : ''}</Text>
        </View>
    </View>
    <View style={styles.row}>
      <FAIcon.Button
        name="cookie-bite"
        backgroundColor={item?.itemState !== ItemState.ACTIVE ? "#D3D3D3" : "green"}
         onPress={() => handleStateChange(item?.id, ItemState.EATEN)}
      >
        Eaten
      </FAIcon.Button>
      {
        item?.itemState !== ItemState.ACTIVE ?
        (
          <Button
            title="Reactivate"
            color="green"
            onPress={() => handleStateChange(item?.id, ItemState.ACTIVE)}
          />
        )
        : ''
      }
      <FAIcon.Button
        name="trash"
        disabled={item?.itemState !== ItemState.ACTIVE}
        backgroundColor={item?.itemState !== ItemState.ACTIVE ? "#D3D3D3" : "#964B00"}
         onPress={() => handleStateChange(item?.id, ItemState.WASTED)}
      >
        Wasted
      </FAIcon.Button>
    </View>
  </View>
);

export default Item;

const styles: any = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    backgroundColor: '#E6E6FA',
    borderRadius: 15,
    height: 150,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'column',
  },
  leftColumn: {
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  rightColumn: {
    height: '100%',
    width: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 20,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButtonWrapper: {
    backgroundColor: '#E6E6FA',
    paddingTop: 50,
  },
});