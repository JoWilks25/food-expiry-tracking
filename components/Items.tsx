import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { GroceryItemType } from '../data/storage';
import { modalDataType } from '../App';

interface ItemProps {
  item: GroceryItemType
  modalData: modalDataType;
  setModalData: (modalData: modalDataType) => void;
  handleDelete: (itemId: number) => void;
}
export const getItem = (data: GroceryItemType, index: number): ItemProps => data[index];

export const getItemCount = (data: ItemProps): number => data.length;

const Item = ({ item, modalData, setModalData, handleDelete }: ItemProps) => (
  <View style={styles.row}>
      <View style={styles.leftColumn}>
        <Text style={styles.date}>{item?.expiryDate}</Text>
        <Text style={styles.name}>{item?.name}</Text>
      </View>
      <View style={styles.rightColumn}>
        <FAIcon
          name="edit"
          color="#3B67CE"
          size={25}
          onPress={() => setModalData({ isVisible: true, selectedId: item?.id })}
        />
        <EntypoIcon
          name="circle-with-cross"
          color="red"
          size={25}
          onPress={() => handleDelete(item?.id)}
        />
      </View>
  </View>
);

export default Item;

const styles: any = StyleSheet.create({
  row: {
    backgroundColor: '#E6E6FA',
    borderRadius: 15,
    height: 150,
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
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