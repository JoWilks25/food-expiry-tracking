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
import { loadFromStorage, saveToStorage, GroceryItemType, ItemState } from '../data/storage';
import { modalDataType } from '../App';


interface IProps {
  modalData: modalDataType;
  setModalData: (modalData: modalDataType) => void;
  groceryData: GroceryItemType[] | undefined;
  setGroceryData: (data: GroceryItemType[]) => void;
}

interface formInputsState {
  expiryDate: any;
  name: string | undefined;
}

const defaultFormInputs = {
  expiryDate: new Date(),
  name: '',
}

const ModalView = ({ modalData, setModalData, groceryData, setGroceryData }: IProps) => {

  const [formInputs, setFormInputs] = useState<formInputsState>({
    expiryDate: new Date(),
    name: '',
  })

  useEffect(() => {
    if (modalData.selectedId) {
      const selectedgroceryDatum = groceryData?.find((groceryDatum) => groceryDatum.id === modalData.selectedId)
      setFormInputs({
        expiryDate: new Date(selectedgroceryDatum?.expiryDate),
        name: selectedgroceryDatum?.name,
      })
    }
    // Clear formInputs to default when modal closed
    return () => setFormInputs(defaultFormInputs);
  }, [modalData?.selectedId])

  const onChangeDate = (event: any, selectedDate: any): void => setFormInputs(currState => ({
    ...currState,
    expiryDate: selectedDate,
  }))

  const handleOnPress = () => {
    if (!formInputs.name) {
      return Alert.alert("Please enter a name!")
    }
    loadFromStorage('groceryData')
      .then((groceryDataObject: any) => {
        let newGroceryData = {...groceryDataObject}
        const todaysDate = moment().format('YYYY-MM-DD');
        const expiryDate = moment(formInputs.expiryDate).format('YYYY-MM-DD');
        if (modalData?.selectedId) {
          const foundIndex = groceryDataObject?.items?.findIndex((groceryDatum: GroceryItemType) => groceryDatum.id === modalData.selectedId)
          Object.assign(groceryDataObject.items[foundIndex], {
            name: formInputs.name,
            expiryDate: expiryDate,
            lastUpdateDate: todaysDate,
          })
        } else {
          const newId = groceryDataObject?.lastId + 1;
          newGroceryData = {
            lastId: newId,
            items: [
              ...groceryDataObject.items,
              {
                id: newId,
                addDate: todaysDate,
                units: 1,
                name: formInputs.name,
                expiryDate: expiryDate,
                lastUpdateDate: null,
                itemState: ItemState.ACTIVE,
              }
            ]
          }
        }
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
            <Button title={modalData?.selectedId ? "Save" : "Add"} onPress={handleOnPress}/>
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

export default ModalView;