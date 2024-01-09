import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { loadFromStorage, saveToStorage, GroceryItemType, ItemState } from '../utilities/storage';
import { addNotification, updateNotification } from '../utilities/notifications';
import { modalDataType } from '../screens/MainScreen';

const dateFormat = 'YYYY-MM-DD';

interface IProps {
  modalData: modalDataType;
  setModalData: (modalData: modalDataType) => void;
  groceryData: GroceryItemType[] | undefined;
  setGroceryData: (data: GroceryItemType[]) => void;
}

interface formInputsState {
  expiryDate: any;
  reminderDate: any;
  name: string;
}

const DEFAULT_REMINDER = 1 // i.e. 1 day before expiry

const defaultFormInputs = {
  expiryDate: new Date(),
  reminderDate: null,
  name: '',
}

const ItemModalView = ({ modalData, setModalData, groceryData, setGroceryData }: IProps) => {

  const [formInputs, setFormInputs] = useState<formInputsState>(defaultFormInputs)

  useEffect(() => {
    if (modalData.selectedId) {
      const selectedgroceryDatum = groceryData?.find((groceryDatum) => groceryDatum.id === modalData.selectedId)
      if (selectedgroceryDatum) {
        setFormInputs({
          expiryDate: new Date(selectedgroceryDatum.expiryDate),
          reminderDate: new Date(selectedgroceryDatum.reminderDate),
          name: selectedgroceryDatum?.name,
        })
      } else {
        console.error('Unable to find existing groceryItem')
      }
    }
    // Clear formInputs to default when modal closed
    return () => setFormInputs(defaultFormInputs);
  }, [modalData?.selectedId])

  const onChangeDate = (event: any, selectedDate: any): void => setFormInputs(currState => ({
    ...currState,
    expiryDate: selectedDate,
  }))

  const handleEditAdd = () => {
    if (!formInputs.name) {
      return Alert.alert("Please enter a name!");
    }
    loadFromStorage('groceryData')
      .then( async (groceryDataObject: any) => {
        let newGroceryData = {...groceryDataObject};
        const todaysDate = moment().format(dateFormat);
        const expiryDate = moment(formInputs.expiryDate).format(dateFormat);
        const reminderDate = moment(formInputs.expiryDate).subtract(DEFAULT_REMINDER, 'days').format(dateFormat)
        // EDITING
        if (modalData?.selectedId) {
          const foundIndex = groceryDataObject?.items?.findIndex((groceryDatum: GroceryItemType) => groceryDatum.id === modalData.selectedId);
          // Raise alert if name or expiry not changed
          if (
            formInputs.name !== groceryDataObject.items[foundIndex].name
            && expiryDate !== groceryDataObject.items[foundIndex].expiryDate
          ) {
            Alert.alert("No Changes Made");
          }
          // Create new object
          const newObject = {
            lastUpdateDate: todaysDate,
            name: formInputs.name,
            expiryDate,
            reminderDate,
          };
          // Check if expiry date changed, only trigger notification update/adding
          if (expiryDate !== groceryDataObject.items[foundIndex].expiryDate) {
            // Update Notfication
            const scheduleId = await updateNotification(groceryDataObject.items, newObject)
            // Object.assign(newObject, { scheduleIds: [...groceryDataObject.items[foundIndex].scheduleIds, scheduleId], });
          }
          // Override object within groceryDataObject
          Object.assign(groceryDataObject.items[foundIndex], newObject);
        } else {
          // ADDING
          const newId = groceryDataObject?.lastId + 1;
          const newGroceryDataObject: GroceryItemType = {
            id: newId,
            addDate: todaysDate,
            units: 1,
            name: formInputs.name,
            expiryDate: expiryDate,
            reminderDate: reminderDate,
            lastUpdateDate: null,
            itemState: ItemState.ACTIVE,
            // scheduleIds: [expiryDate, ],
          }
          // // Add scheduleId 
          // const scheduleId = await addNotification(groceryDataObject.items, newGroceryDataObject)
          // newGroceryDataObject.scheduleIds.push(scheduleId);
          // console.log('newGroceryDataObject', newGroceryDataObject)
          // console.log('scheduleId', scheduleId)
          newGroceryData = {
            lastId: newId,
            items: [
              ...groceryDataObject.items,
              newGroceryDataObject,
            ]
          }
        }
        // Update relevant states
        console.log('newGroceryData:', newGroceryData)
        saveToStorage('groceryData', newGroceryData)
        setGroceryData(newGroceryData.items)
        setModalData({ isVisible: false, selectedId: null, })
        setFormInputs(defaultFormInputs)
      })
      .catch((error: any) => {
      console.log('error', error)
    });
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalData.isVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalData({ ...modalData, isVisible: !modalData.isVisible, })
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button onPress={() => {
                setModalData({ selectedId: null, isVisible: !modalData.isVisible, });
                setFormInputs(defaultFormInputs);
              }}
              title="X" />
            <Text style={styles.modalText}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => setFormInputs(currState => ({
                ...currState,
                name: value,
              }))}
              value={formInputs.name}
            />
            <DateTimePicker
              testID="dateTimePicker"
              value={formInputs.expiryDate}
              mode={'date'}
              is24Hour={true}
              onChange={onChangeDate}
              />
            <Button title={modalData?.selectedId ? "Save" : "Add"} onPress={handleEditAdd}/>
          </View>
        </View>
      </Modal>
    </View>
  )
}


export const styles: any = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    width: 150,
    padding: 10,
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

export default ItemModalView;