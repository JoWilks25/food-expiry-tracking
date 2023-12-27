import React from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { GroceryItemType } from '../data/storage';
import { styles } from '../styles/styles';
import { modalDataType } from '../App';

interface ItemProps {
  item: GroceryItemType
  modalData: modalDataType;
  setModalData: (modalData: modalDataType) => void;
}
export const getItem = (data: GroceryItemType, index: number): ItemProps => data[index];

export const getItemCount = (data: ItemProps): number => data.length;

const Item = ({ item, modalData, setModalData }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.date}>{item?.expiryDate}</Text>
    <Text style={styles.name}>{item?.name}</Text>
    <Button title="Edit" onPress={() => setModalData({ isVisible: true, selectedId: item?.id })} />
  </View>
);

export default Item