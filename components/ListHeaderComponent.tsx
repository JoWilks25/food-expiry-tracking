import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles/styles';


const ListHeaderComponent = () => {
  return (
    <View style={styles.headerView}>
      <Icon.Button
        name={true ? 'sort-amount-asc' : 'sort-amount-desc'}
        // backgroundColor="#3b5998"
        onPress={() => console.log('sort by date')}
      >
       Expiry Date
      </Icon.Button>
      <Icon.Button
        name={true ? 'sort-alpha-asc' : 'sort-alpha-desc'}
        onPress={() => console.log('sort by alphabetical')}
      >
        Alphabetical
      </Icon.Button>
    </View>
  )
}

export default ListHeaderComponent;