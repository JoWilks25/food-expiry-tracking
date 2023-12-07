import React from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { GroceryItemType } from '../dummyData';
import { styles } from '../styles/styles';

interface ItemProps extends GroceryItemType {
  tempId: number;
}
export const getItem = (data: GroceryItemType, index: number): ItemProps => {
  return {
    tempId: index,
    ...data[index]
  }
};

export const getItemCount = (data: ItemProps): number => data.length;


const Item = ({ title, date }: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.date}>{date}</Text>
    <Text style={styles.title}>{title}</Text>
    <Button title="Edit" onPress={() => console.log(`Clicked ${title}`)} />
  </View>
);

export default Item