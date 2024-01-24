import React from 'react';
import {
  View,
  Modal,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AntIcon from 'react-native-vector-icons/AntDesign';
import { filterModalType } from '../screens/MainScreen';
import { ItemState } from '../utilities/storage';


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
          <View style={styles.closeButtonWrapper}>
              <AntIcon
                name='close'
                color='black'
                size={25}
                onPress={() => {
                  setFilterModal({ ...filterModal, isVisible: !filterModal.isVisible, });
                }}
              />
            </View>
          {/* <Button onPress={() => {
            setFilterModal({ ...filterModal, isVisible: !filterModal.isVisible, });
              }}
            title="X" /> */}
          {
            [ItemState.ACTIVE, ItemState.DELETED, ItemState.EATEN, ItemState.WASTED]?.map((item) => {
              return (
                <View style={styles.checkboxWrapper} key={item}>
                  <BouncyCheckbox
                    fillColor="#3b5998"
                    textStyle={{
                      textDecorationLine: "none",
                    }}
                    isChecked={filterModal.itemStates.includes(item)}
                    text={item}
                    disableBuiltInState
                    onPress={() => onValueChange(item)}
                  />
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
    width: "50%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
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
  checkboxWrapper: {
    flexDirection: 'row',
    paddingBottom: 15,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  checkbox: {
    textDecorationLine: 'underline',  
  },
  closeButtonWrapper: {
    width: '100%',
    display: 'flex',                                                                      
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export default FilterModalView;