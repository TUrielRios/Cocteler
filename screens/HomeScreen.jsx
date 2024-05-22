import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IngredientSearch from '../components/IngredientSearch';
import ImageSlider from '../components/ImageSlider';
import ListTragos from '../components/ListTragos';
import data from '../data/api.json';

const HomeScreen = () => {

  const [filteredTragos, setFilteredTragos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);



  const handleSearch = (selectedIngredients) => {
    if (selectedIngredients.length === 0) {
      setErrorMessage('No se seleccionó ningún ingrediente');
      setFilteredTragos([]);
      resetErrorMessage();
      return;
    }
  
    const filtered = data.filter((trago) => {
      return selectedIngredients.every((selectedIngredient) =>
        trago.ingredientes.some(
          (ingrediente) =>
            ingrediente.nombre.toLowerCase().includes(selectedIngredient.toLowerCase())
        )
      );
    });
  
    if (filtered.length === 0) {
      setErrorMessage('No se encontraron tragos con los ingredientes seleccionados');
      setFilteredTragos([]);
      resetErrorMessage();
      return;
    }
  
    setErrorMessage(null);
    setFilteredTragos(filtered);
  };

  const resetErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <ImageSlider />
      </View>
      <View style={styles.searchContainer}>
        <IngredientSearch onSearch={handleSearch} />
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      </View>
      <View style={styles.tragosContainer}>
        <ListTragos data={data} filteredTragos={filteredTragos} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:50
  },
  sliderContainer: {
    height: 280,
  },
  searchContainer: {
    paddingHorizontal: 20,
  },
  tragosContainer: {
    flex: 1,
    alignSelf:'center',
    padding: 0,
    },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
