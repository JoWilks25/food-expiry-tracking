import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';


const FileSelectorComponent = () => {
  const pickDocument = async () => {
    let document
    try {
      document = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      })
      console.log('document', document)
      if (!document.canceled) {
        const file = await FileSystem.readAsStringAsync(document?.assets?.[0]?.uri, { encoding: 'base64' })
        console.log('file', file)
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