import React from 'react';
import {
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles/styles';
import { SortByType } from '../App';

type ListHeaderComponentProps = {
  sortBy: SortByType;
  setSortBy: React.Dispatch<React.SetStateAction<SortByType>>;
};

const ListHeaderComponent = ({sortBy, setSortBy}: ListHeaderComponentProps) => {
  return (
    <View style={styles.headerView}>
      <Icon.Button
        name={sortBy.sortName === 'expiryDate' && sortBy.sortOrder === 'asc' ? 'sort-amount-asc' : 'sort-amount-desc'}
        // backgroundColor="#3b5998"
        onPress={() => setSortBy({ sortName: 'expiryDate', sortOrder: sortBy.sortOrder === 'asc' ? 'desc' : 'asc' })}
      >
       Expiry Date
      </Icon.Button>
      <Icon.Button
        name={sortBy.sortName === 'name' && sortBy.sortOrder === 'asc' ? 'sort-alpha-asc' : 'sort-alpha-desc'}
        onPress={() => setSortBy({ sortName: 'name', sortOrder: sortBy.sortOrder === 'asc' ? 'desc' : 'asc' })}
      >
        Alphabetical
      </Icon.Button>
    </View>
  )
}

export default ListHeaderComponent;