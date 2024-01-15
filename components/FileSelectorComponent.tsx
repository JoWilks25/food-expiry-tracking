import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import { loadFromStorage, saveToStorage, GroceryItemType, ItemState } from '../utilities/storage';
import { DEFAULT_REMINDER, ReminderType, updateNotification, DEFAULT_DATE_FORMAT } from '../utilities/notifications';

interface IProps {
  setGroceryData: (data: GroceryItemType[]) => void;
  setIsLoading: (state: boolean) => void;
}

const TEXT_DATE_FORMAT = 'DD/MM/YYYY';

const FileSelectorComponent = ({ setGroceryData }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleEditAdd = async (itemArray: string[]): Promise<void> => {
    loadFromStorage('groceryData')
      .then( async (groceryDataObject: any) => {
        const todaysDate = moment().format(DEFAULT_DATE_FORMAT);
        const groceryItemsArray = [...groceryDataObject.items];
        let lastId = groceryDataObject.lastId;
        itemArray.forEach(async (row: string, index: number): Promise<void> => {
          // Item Data
          const [expiryDateString, itemName, units] = row.split(',');
          // Notification Dates
          const expiryDate = moment(expiryDateString, TEXT_DATE_FORMAT).format(DEFAULT_DATE_FORMAT);
          const reminderDate = moment(expiryDateString, TEXT_DATE_FORMAT).subtract(DEFAULT_REMINDER, 'days').format(DEFAULT_DATE_FORMAT);
          // Check if items expiry date is greater than today
          if (moment(expiryDate).isSameOrBefore(moment()) || expiryDate === "Invalid date") {
            console.debug("Item had expiry date same as or less than today, or was an Invalid date, will not add:", expiryDate);
            return;
          }
          // Construct new grocer item to add to newGroceryData
          lastId += 1;
          const newGroceryDataObject: GroceryItemType = {
            id: lastId,
            addDate: todaysDate,
            units: Number(units),
            name: itemName,
            expiryDate: expiryDate,
            reminderDate: reminderDate,
            lastUpdateDate: null,
            itemState: ItemState.ACTIVE,
          }
          groceryItemsArray.push(newGroceryDataObject);
          // Update or Add Notification for items expiry date
          try {
            await updateNotification(expiryDate, ReminderType.dayOf);
          } catch (error) {
            console.log(error);
          }
          // Update or Add Notification for items day before expiry date
          try {
            await updateNotification(reminderDate, ReminderType.before);
          } catch (error) {
            console.log(error);
          }
        })
        let newGroceryData = {
          lastId,
          items: groceryItemsArray,
        };
        // Update relevant states
        saveToStorage('groceryData', newGroceryData);
        setGroceryData(newGroceryData.items);
      })
      .catch((error: any) => {
        console.log('error', error);
    });
  }

  const pickDocument = async () => {
    let document
    try {
      document = await DocumentPicker.getDocumentAsync({ type: 'text/plain' });
      if (!document.canceled) {
        const fileContents = await FileSystem.readAsStringAsync(document?.assets?.[0]?.uri);
        const itemArray = fileContents.split('\n');
        setIsLoading(true);
        await handleEditAdd(itemArray);
        setIsLoading(false);
      }
    } catch (err) {
      if (document?.canceled) {
        // User cancelled the document picker
      } else {
        console.error('err:', err);
        throw err;
      }
      setIsLoading(false);
    }
  };
  console.log('isLoading', isLoading)
  return (
    <View>
      <Button title="Pick Document" onPress={pickDocument} />
    </View>
  );
};
export default FileSelectorComponent;