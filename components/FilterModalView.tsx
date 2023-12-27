import React from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { filterModalType } from '../App';
import { ItemState } from '../data/storage';


interface IProps {
  filterModal: filterModalType;
  setFilterModal: (filterModal: filterModalType) => void;
}

const FilterModalView = ({ filterModal, setFilterModal }: IProps) => {

  const onValueChange = (itemState: ItemState): void => {
    // if itemstate already in array remove, if not in array add
    const  selectedItemStates = filterModal.itemStates.includes(itemState)
      ? filterModal.itemStates.filter((state) => state !== itemState)
      : [...filterModal.itemStates, itemState]
    setFilterModal({ ...filterModal, itemStates: selectedItemStates })
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={filterModal.isVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setFilterModal({ ...filterModal, isVisible: !filterModal.isVisible, })
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <Button onPress={() => {
            setFilterModal({ ...filterModal, isVisible: !filterModal.isVisible, });
              }}
            title="X" />
          {
            [ItemState.ACTIVE, ItemState.DELETED, ItemState.EATEN, ItemState.WASTED]?.map((item) => {
              return (
                <View style={styles.checkbox} key={item}>
                  <CheckBox
                    disabled={false}
                    value={filterModal.itemStates.includes(item)}
                    onValueChange={() => onValueChange(item)}
                    boxType="circle"
                    animationDuration={0.1}
                    onAnimationType="fade"
                  />
                  <Text style={styles.checkboxText}>{item}</Text>
                </View>
                  )
                })
              }
          </View>
        </View>
      </Modal>
    </View>
  )
}


export const styles: any = StyleSheet.create({
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
  checkbox: {
    flexDirection: 'row',
    paddingBottom: 15,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  checkboxText: {
    paddingLeft: 7.5,
  }
});

export default FilterModalView;