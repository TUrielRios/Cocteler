import React, {useRef} from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;


const SearchTragoCard = ({ trago }) => {
  const navigation = useNavigation();
  const { sabor } = trago;
  const animatedValue = useRef(new Animated.Value(0)).current;

  const getSaborColor = () => {
    switch (sabor.toLowerCase()) {
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

  const animateCard = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const cardStyle = {
    opacity: animatedValue,
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[styles.container, { width: windowWidth - 20 }, cardStyle]} onLayout={animateCard}>
        <View style={[styles.imageContainer, saborStyles]}>
          <Image source={{ uri: trago.foto }} style={styles.image} />
        </View>
        <View style={styles.content}>
          <Text style={styles.nombre}>{trago.nombre}</Text>
        </View>
      </Animated.View>
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
    height: 75,
    width: 70,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 0,
    resizeMode: 'contain',
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

export default SearchTragoCard;