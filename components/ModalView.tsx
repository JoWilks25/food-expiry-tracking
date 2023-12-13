import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { loadFromStorage, saveToStorage, GroceryItemType } from '../data/storage';


interface IProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  groceryData: GroceryItemType[];
  setGroceryData: (data: GroceryItemType[]) => void;
}

interface formInputsState {
  expiryDate: any;
  name: string;
}

const defaultFormInputs = {
  expiryDate: new Date(),
  name: '',
}

const ModalView = ({ modalVisible, setModalVisible, groceryData, setGroceryData }: IProps) => {

  const [formInputs, setFormInputs] = useState<formInputsState>({
    expiryDate: new Date(),
    name: '',
  })

  const onChangeDate = (event: any, selectedDate: any): void => setFormInputs(currState => ({
    ...currState,
    expiryDate: selectedDate,
  }))

  const handleOnPress = () => {
    loadFromStorage('groceryData').then((groceryDataObject: any) => {
      const newId = groceryDataObject?.lastId + 1
      const todaysDate = moment().format('YYYY-MM-DD')
      const newGroceryData = {
        lastId: newId,
        items: [
          ...groceryDataObject.items,
          {
            id: newId,
            addDate: todaysDate,
            units: 1,
            name: formInputs.name,
            expiryDate: moment(formInputs.expiryDate).format('YYYY-MM-DD'),
          }
        ]
      }
      
      saveToStorage('groceryData', newGroceryData)
      setGroceryData(newGroceryData.items)
      setModalVisible(false)
      setFormInputs(defaultFormInputs)
    });
  }

  return (
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
            <Button onPress={() => setModalVisible(!modalVisible)} title="X" />
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
            <Button title="Add" onPress={handleOnPress}/>
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