import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const handleNavigation = () => {
    navigation.navigate('Main');
  };

  const animatedValue = useRef(new Animated.Value(-200)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(true);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(250),
      Animated.timing(animatedValue, {
        toValue: -200,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
    ]).start();

    // Simulamos la navegación a la pantalla "Main" después de 6 segundos
    const timeout = setTimeout(() => {
      if (isMounted.current) {
        navigation.navigate('Main');
      }
    }, 3000);

    return () => {
      isMounted.current = false;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/LOGO/logoedit.png')}
        style={[styles.logo, { transform: [{ translateY: animatedValue }]}]}
      />
      <Animated.Text style={[styles.title, { opacity: animatedOpacity }]}>Cócteler</Animated.Text>
      <TouchableOpacity style={styles.button} onPress={handleNavigation}>
        <Animated.Text style={[styles.buttonText, { opacity: animatedOpacity }]}>Acceder</Animated.Text>
      </TouchableOpacity>
      <Animated.Text style={{position: 'absolute', bottom: 20, fontSize: 12, textTransform: 'uppercase', fontWeight:'700'}}>Por Tiziano Rios</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 20,
    color: '#9e0f09', // Color del texto
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Color de la sombra del texto
    textShadowOffset: { width: 2, height: 2 }, // Desplazamiento de la sombra
    textShadowRadius: 5, // Radio de la sombra
    // También puedes agregar otros estilos como degradados, animaciones, etc.
  },
  button: {
    backgroundColor: '#9e0f09',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    letterSpacing: -0.5,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

export default WelcomeScreen;
