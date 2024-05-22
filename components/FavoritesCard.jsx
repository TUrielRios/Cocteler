import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const FavoritesCard = ({ trago, onPressRemove, onPressTragoDetail }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPressTragoDetail(trago)}>
      <Image source={{ uri: trago.foto }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.nombre}>{trago.nombre}</Text>
        {/* Agrega aquí más detalles del trago si lo deseas */}
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={onPressRemove}>
        <FontAwesomeIcon icon={faHeart} size={30} style={{ backgroundColor: 'white',color: 'red' }} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 10,
    borderRadius: 5,
  },
});

export default FavoritesCard;
