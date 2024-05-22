import React, { useState } from 'react';
import { TextInput, View, StyleSheet} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de importar el icono adecuado para tu proyecto

const SearchBar = ({ value, onChangeText, onSubmit }) => {
  const clearText = () => {
    onChangeText(''); // Limpia el texto
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar trago por nombre..."
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
            {value ? (
          <AntDesign name="close" size={24} color="white" backgroundColor="#C11326" padding={5} onPress={clearText} />
      ) : (
        
        <AntDesign name="search1" size={24} color="white" backgroundColor="#C11326" padding={5} />
      )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
});

export default SearchBar;
