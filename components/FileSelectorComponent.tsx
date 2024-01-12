import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import { loadFromStorage, saveToStorage, GroceryItemType, ItemState } from '../utilities/storage';
import { DEFAULT_REMINDER, ReminderType, updateNotification, DEFAULT_DATE_FORMAT } from '../utilities/notifications';

interface IProps {
  setGroceryData: (data: GroceryItemType[]) => void;
}

const FileSelectorComponent = ({setGroceryData}: IProps) => {
  
  const handleEditAdd = (itemArray: string[]): void => {
    loadFromStorage('groceryData')
      .then( async (groceryDataObject: any) => {
        let newGroceryData = {...groceryDataObject};
        const todaysDate = moment().format(DEFAULT_DATE_FORMAT);
        itemArray.forEach(async (row: string): Promise<void> => {
          // Item Data
          const [expiryDateString, itemName, units] = row.split(',');
          console.log('****', row, expiryDateString, itemName, units)
          // Notification Dates
          const expiryDate = moment(expiryDateString, 'DD/MM/YYYY').format(DEFAULT_DATE_FORMAT);
          const reminderDate = moment(expiryDateString).subtract(DEFAULT_REMINDER, 'days').format(DEFAULT_DATE_FORMAT)
          // Check if items expiry date is greater than today
          if (moment(expiryDate).isSameOrBefore(moment()) || expiryDate === "Invalid date") {
            console.debug("Item had expiry date same as or less than today, or was an Invalid date, will not add:", expiryDate);
            return;
          }
          // Construct new grocer item to add to newGroceryData
          const newId = groceryDataObject?.lastId + 1;
          const newGroceryDataObject: GroceryItemType = {
            id: newId,
            addDate: todaysDate,
            units: Number(units),
            name: itemName,
            expiryDate: expiryDate,
            reminderDate: reminderDate,
            lastUpdateDate: null,
            itemState: ItemState.ACTIVE,
          }
          // Update or Add Notification for items expiry date
          console.log('Went too far', expiryDateString, expiryDate)
          try {
            await updateNotification(expiryDate, ReminderType.dayOf)
          } catch (error) {
            console.log(error)
          }
          // Update or Add Notification for items day before expiry date
          try {
            await updateNotification(reminderDate, ReminderType.before)
          } catch (error) {
            console.log(error)
          }
          newGroceryData = {
            lastId: newId,
            items: [
              ...groceryDataObject.items,
              newGroceryDataObject,
            ]
          }
        })
        console.log('newGroceryData', newGroceryData)
        // Update relevant states
        // saveToStorage('groceryData', newGroceryData)
        // setGroceryData(newGroceryData.items)
      })
      .catch((error: any) => {
        console.log('error', error)
    });
  }

  const pickDocument = async () => {
    let document
    try {
      document = await DocumentPicker.getDocumentAsync({
        type: 'text/plain',
      })
      console.log('document', document)
      if (!document.canceled) {
        const fileContents = await FileSystem.readAsStringAsync(document?.assets?.[0]?.uri);
        console.log('fileContents', fileContents)
        const itemArray = fileContents.split('\n');
        console.log('itemArray', itemArray)
        handleEditAdd(itemArray)
      }
    } catch (err) {
      if (document?.canceled) {
        // User cancelled the document picker
      } else {
        console.error('err:', err)
        throw err;
      }
    }
  };

  return (
    <View>
      <Button title="Pick Document" onPress={pickDocument} />
      {/* <Button title="Upload File" onPress={uploadFile} /> */}
    </View>
  );
};
export default FileSelectorComponent;