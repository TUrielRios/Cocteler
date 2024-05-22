import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const IngredientSearch = ({ onSearch }) => {
  const [ingredient, setIngredient] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredienteAEliminar, setIngredienteAEliminar] = useState(null);

  const handleAddIngredient = () => {
    if (ingredient.trim() !== '') {
      setSelectedIngredients([...selectedIngredients, ingredient.trim()]);
      setIngredient('');
    }
  };

  const handleSearch = () => {
    onSearch(selectedIngredients);
  };

  const handleReset = () => {
    setSelectedIngredients([]);
    onSearch([]); // Actualizar los datos de búsqueda con una lista vacía
  };

  useEffect(() => {
    if (ingredienteAEliminar !== null) {
      setSelectedIngredients((prevSelectedIngredients) =>
        prevSelectedIngredients.filter((_, index) => index !== ingredienteAEliminar)
      );
      setIngredienteAEliminar(null);
    }
  }, [ingredienteAEliminar]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué ingredientes tienes en casa?</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa un ingrediente"
          value={ingredient}
          onChangeText={setIngredient}
        />
        <Pressable style={styles.addButton} onPress={handleAddIngredient}>
          <AntDesign name="plus" size={20} color="white" />
        </Pressable>
      </View>
      <View style={styles.ingredientContainer}>
        {selectedIngredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.ingredientText}>{ingredient}</Text>
            <Pressable onPress={() => setIngredienteAEliminar(index)}>
              <AntDesign name="close" size={16} color="gray" />
            </Pressable>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Restablecer</Text>
        </Pressable>
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 0,
  },
  title: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '800',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: '#C11326',
    borderRadius: 20,
    padding: 8,
  },
  ingredientContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -4,
    marginLeft: -4,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginVertical: 4,
  },
  ingredientText: {
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  resetButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#C11326',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default IngredientSearch;
