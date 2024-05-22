import React, {useRef} from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;


const ExploreTragoCard = ({ trago }) => {
  const navigation = useNavigation();
  const { sabor } = trago;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const getSaborColor = () => {
    switch (sabor.toLowerCase()) {
      case 'amargo':
        return { backgroundColor: '#c11326', color: 'white' };
      case 'dulce':
        return { backgroundColor: '#D9B595', color: 'brown' };
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
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.container, cardStyle]} onLayout={animateCard}>
    <TouchableOpacity style={styles.container} onPress={handlePress}>
            <ImageBackground source={{ uri: trago.fondo }} style={styles.image} resizeMode="cover" >
            </ImageBackground>
          <View style={[styles.content, saborStyles]}>
            <Text style={[styles.nombre, saborStyles]}>{trago.nombre}</Text>
          </View>

        </TouchableOpacity>
        </Animated.View>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderColor: 'black',

    height: 200,
    margin: 5,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: {
      width: 0,
      height: 2, // Ajusta la altura de la sombra según tu preferencia
    },
    shadowOpacity: 0.75, // Opacidad de la sombra
    shadowRadius: 3.84, // Radio de la sombra
    elevation: 5, // Elevación para que la sombra se vea mejor en dispositivos Android
  
  },
  imageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#d9b595',
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  image: {
    width: 200,
    height: 150,
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
    width: '100%'
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

export default ExploreTragoCard;