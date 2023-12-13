import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
        backgroundColor={sortBy.sortName === 'expiryDate' ? '#3b5998' : "lightgrey"}
        onPress={() => setSortBy({ sortName: 'expiryDate', sortOrder: sortBy.sortOrder === 'asc' ? 'desc' : 'asc' })}
      >
       Expiry Date
      </Icon.Button>
      <Icon.Button
        name={sortBy.sortName === 'name' && sortBy.sortOrder === 'asc' ? 'sort-alpha-asc' : 'sort-alpha-desc'}
        backgroundColor={sortBy.sortName === 'name' ? '#3b5998' : "lightgrey"}
        onPress={() => setSortBy({ sortName: 'name', sortOrder: sortBy.sortOrder === 'asc' ? 'desc' : 'asc' })}
      >
        Alphabetical
      </Icon.Button>
    </View>
  )
}

const styles: any = StyleSheet.create({
  headerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 4,
  },
})

export default ListHeaderComponent;