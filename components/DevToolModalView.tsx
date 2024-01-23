import React from 'react';
import {
  View,
  Modal,
  Alert,
  StyleSheet,
  Button,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { cancelAllScheduledNotificationsAsync } from 'expo-notifications';
import { devToolDataType } from '../screens/MainScreen';
import storage, { loadFromStorage } from '../utilities/storage';


interface IProps {
  saveNewState: (key: string, data: { [key: string]: any }) => Promise<void>;
  devToolData: devToolDataType;
  setDevToolData: (devToolData: devToolDataType) => void;
}

const DevToolView = ({ saveNewState, devToolData, setDevToolData }: IProps) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={devToolData.isVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setDevToolData({ isVisible: !devToolData.isVisible, })
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Button onPress={() => {
              setDevToolData({ isVisible: !devToolData.isVisible, });
            }}
            title="X" />
            <Button
              title="Reset Storage"
              onPress={() => {
                storage.remove({
                  key: 'groceryData',
                }).then(async () => {
                  saveNewState('groceryData', { lastId: 0, items: [], });
                  await cancelAllScheduledNotificationsAsync();
                  setDevToolData({ isVisible: !devToolData.isVisible, });
                });
              }}
            />
             <Button
              title="Export localStorage"
              onPress={() => {
                loadFromStorage('groceryData')
                  .then( async (groceryDataObject: any) => {
                    console.log('groceryDataObject:', groceryDataObject)
                  })
                  .catch((error: any) => {
                    console.log('error', error)
                });
              }}
            />
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

export default DevToolView;