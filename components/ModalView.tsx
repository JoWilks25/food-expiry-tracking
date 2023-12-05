import React from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import { styles } from '../styles';

interface IProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const ModalView = ({ modalVisible, setModalVisible }: IProps) => {
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
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ModalView;