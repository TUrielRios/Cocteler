import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;


const TragoCard = ({ trago }) => {
  const navigation = useNavigation();
  const { sabor } = trago;
  const getSaborColor = () => {
    switch (sabor.toLowerCase()) {
      case 'agridulce':
        return {backgroundColor: '#FFD700', color:'black'}
      case 'amargo':
        return { backgroundColor: '#c11326', color: 'white' };
      case 'dulce':
        return { backgroundColor: '#D9B595', color: 'black' };
      case 'cítrico':
        return { backgroundColor: '#F8D568', color: 'black' };
      case 'menta':
        return { backgroundColor: 'darkgreen', color: 'white' };
      case 'elegante':
        return { backgroundColor: '#333399', color: 'white' };
      case 'refrescante':
        return { backgroundColor: '#66CCCC', color: 'white' };
      case 'clásico':
        return { backgroundColor: '#430D09', color: 'white' };
      case 'refinado':
        return { backgroundColor: '#1C1A1A', color: 'white' };  
      case 'frutal':
        return { backgroundColor: '#DB5A6B', color: 'white' };
      case 'salado':
        return { backgroundColor: '#ADD8E6', color: 'white' };
      case 'picante':
      return { backgroundColor: '#FF2400', color: 'white' };
      case 'floral':
        return { backgroundColor: '#FFB6C1', color: 'black' };
      case 'fuerte':
        return { backgroundColor: '#FFA500', color: 'white' };
      case 'herbal':
        return { backgroundColor: '#4B5320', color: 'white' };
      case 'café':
        return { backgroundColor: '#6F4E37', color: 'white' };
      default:
        return { backgroundColor: 'gray', color: 'white' };
    }
  };

  const saborStyles = getSaborColor();

  const handlePress = () => {

    navigation.navigate('TragoDetail', { trago });
  };

  return (
    <TouchableOpacity style={[styles.container, { width: windowWidth - 70 }]} onPress={handlePress}>
          <View style={[styles.imageContainer, saborStyles]}>
            <Image source={{ uri: trago.foto }} style={styles.image} />
          </View>
          <View style={styles.content}>
            <Text style={styles.nombre}>{trago.nombre}</Text>
            <Text style={styles.metodo}>{trago.metodo}</Text>
            <Text style={[styles.sabor, saborStyles]}>{trago.sabor}</Text>
          </View>
        </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d9b595',
    marginLeft: 10,
    borderRadius: 10,
    height: 80,
    width: 90,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 0,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nombre: {
    fontWeight: '800',
    fontSize: 12,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  metodo: {
    fontStyle: 'italic',
    marginBottom: 5,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5,
    textTransform:'uppercase',
    fontSize: 10
  },
  sabor: {
    fontStyle: 'italic',
    marginBottom: 5,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 5,
    fontWeight: '600',
    textTransform:'uppercase',
    fontSize: 10
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4a5568', // Tailwind: text-gray-700
  },
});

export default TragoCard;