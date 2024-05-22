import React from 'react';
import { View, FlatList } from 'react-native';
import TragoCard from './TragoCard';

const ListTragos = ({ filteredTragos }) => {
  return (
    <View>
      <FlatList
        style={{width: '100%'}}
        data={filteredTragos}
        renderItem={({ item }) => <TragoCard trago={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ListTragos;
