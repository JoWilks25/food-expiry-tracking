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
import AntIcon from 'react-native-vector-icons/AntDesign';
import { loadFromStorage, saveToStorage, GroceryItemType, ItemState } from '../utilities/storage';
import { modalDataType } from '../screens/MainScreen';
import { DEFAULT_REMINDER, ReminderType, addNotification, updateNotification, DEFAULT_DATE_FORMAT } from '../utilities/notifications';


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
  units: number;
}

const defaultFormInputs = {
  expiryDate: new Date(),
  reminderDate: null,
  name: '',
  units: 1,
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
          units: Number(selectedgroceryDatum?.units),
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
    if (Number(formInputs.units) < 1) {
      return Alert.alert("Please select a quantity greater than 0!")
    }
    loadFromStorage('groceryData')
      .then( async (groceryDataObject: any) => {
        let newGroceryData = {...groceryDataObject};
        const todaysDate = moment().format(DEFAULT_DATE_FORMAT);
        const expiryDate = moment(formInputs.expiryDate).format(DEFAULT_DATE_FORMAT);
        const reminderDate = moment(formInputs.expiryDate).subtract(DEFAULT_REMINDER, 'days').format(DEFAULT_DATE_FORMAT)
        // EDITING
        if (modalData?.selectedId) {
          const foundIndex = groceryDataObject?.items?.findIndex((groceryDatum: GroceryItemType) => groceryDatum.id === modalData.selectedId);
          // Raise alert if name or expiry not changed
          if (
            formInputs.name !== groceryDataObject.items[foundIndex].name
            && expiryDate !== groceryDataObject.items[foundIndex].expiryDate
          ) {
            Alert.alert("No Changes Made");
            return;
          }
          // Create new object
          const newObject = {
            lastUpdateDate: todaysDate,
            name: formInputs.name,
            units: formInputs.units,
            expiryDate,
            reminderDate,
          };
          // Check if expiry date changed, only trigger notification update/adding
          if (expiryDate !== groceryDataObject.items[foundIndex].expiryDate) {
            // Check if items expiry date is greater than today
            if (moment(expiryDate).isSameOrBefore(moment())) {
              Alert.alert("Please select an expiry date greater than today");
              return;
            }
            // Update notification if necessary
            try {
              await updateNotification(groceryDataObject.items[foundIndex], newObject, ReminderType.dayOf)
            } catch (error) {
              console.log(error)
            }
            try {
              await updateNotification(groceryDataObject.items[foundIndex], newObject, ReminderType.before)
            } catch (error) {
              console.log(error)
            }
          }
          Object.assign(groceryDataObject.items[foundIndex], newObject);
          // Override object within groceryDataObject
        } else {
          // ADDING
          const newId = groceryDataObject?.lastId + 1;
          const newGroceryDataObject: GroceryItemType = {
            id: newId,
            addDate: todaysDate,
            units: formInputs.units,
            name: formInputs.name,
            expiryDate: expiryDate,
            reminderDate: reminderDate,
            lastUpdateDate: null,
            itemState: ItemState.ACTIVE,
          }
          // Check if items expiry date is greater than today
          if (moment(expiryDate).isSameOrBefore(moment())) {
            Alert.alert("Please select an expiry date greater than today");
            return;
          }
          // Update or Add Notification for items expiry date
          try {
            await addNotification(expiryDate, ReminderType.dayOf)
          } catch (error) {
            console.log(error)
          }
          // Update or Add Notification for items day before expiry date
          try {
            await addNotification(reminderDate, ReminderType.before)
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
        }
        // Update relevant states
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
            <View style={styles.closeButtonWrapper}>
              <AntIcon
                name="close"
                color="black"
                size={25}
                onPress={() => {
                  setModalData({ selectedId: null, isVisible: !modalData.isVisible, });
                  setFormInputs(defaultFormInputs);
                }}
              />
            </View>
            <Text style={styles.labelText}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => setFormInputs(currState => ({
                ...currState,
                name: value,
              }))}
              value={formInputs.name}
            />
            <Text style={styles.labelText}>Expiry Date</Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={formInputs.expiryDate}
              mode={'date'}
              is24Hour={true}
              onChange={onChangeDate}
              />
            <Text style={styles.labelText}>Quantity</Text>
            <TextInput 
              style={styles.numberInput}
              keyboardType='numeric'
              onChangeText={(value) => {
                setFormInputs(currState => ({
                  ...currState,
                  units: Number(value),
                }))
              }}
              value={String(formInputs.units)}
              maxLength={10}  //setting limit of input
              returnKeyType="done"
            />
            <Button title={modalData?.selectedId ? "Save" : "Add"} onPress={handleEditAdd}/>
          </View>
        </View>
      </Modal>
    </View>
  )
}


export const styles: any = StyleSheet.create({
  labelText: {
    fontSize: 18,
    fontWeight: "500",
    paddingTop: 20,
    paddingBottom: 5,
  },
  closeButtonWrapper: {
    width: '100%',
    display: 'flex',                                                                      
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  numberInput: {
    height: 40,
    borderWidth: 1,
    width: 50,
    padding: 10,
    textAlign: 'center',
    borderRadius: 5,
    borderColor: 'lightgrey',
  },
  input: {
    height: 40,
    borderWidth: 1,
    minWidth: 250,
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderColor: 'lightgrey',
  },
  // MODAL STYLES
  centeredView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    marginTop: '20%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
});

export default ItemModalView;