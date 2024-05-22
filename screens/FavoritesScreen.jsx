import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoritesCard from '../components/FavoritesCard';


const FavoritesScreen = ({ route, navigation }) => {
  const [favoriteTragos, setFavoriteTragos] = useState([]);

  useEffect(() => {
    // Carga los favoritos al iniciar la pantalla
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favoriteTragos');
        if (storedFavorites) {
          setFavoriteTragos(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from AsyncStorage:', error);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    const { trago, removeFavorite, isLiked } = route.params || {};

    if (trago && isLiked) {
      const isDuplicate = favoriteTragos.some(item => item.nombre === trago.nombre);
      
      if (!isDuplicate) {
        // Agrega el nuevo favorito
        const updatedFavorites = [...favoriteTragos, trago];
        setFavoriteTragos(updatedFavorites);
        AsyncStorage.setItem('favoriteTragos', JSON.stringify(updatedFavorites));
      }
    }

    if (removeFavorite) {
      // Elimina el favorito
      const updatedFavorites = favoriteTragos.filter(item => item !== removeFavorite);
      setFavoriteTragos(updatedFavorites);
      AsyncStorage.setItem('favoriteTragos', JSON.stringify(updatedFavorites));
    }
  }, [route.params]);

  const handleRemoveFavorite = (tragoToRemove) => {
    // Elimina un favorito y actualiza AsyncStorage
    const updatedFavorites = favoriteTragos.filter(item => item !== tragoToRemove);
    setFavoriteTragos(updatedFavorites);
    AsyncStorage.setItem('favoriteTragos', JSON.stringify(updatedFavorites));
    navigation.setParams({ removeFavorite: tragoToRemove });
  };

  const handlePressTragoDetail = (trago) => {
    // Navega a TragoDetail pasando el trago como parámetro
    navigation.navigate('TragoDetail', { trago });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {favoriteTragos.length === 0 ? (
        <>
          <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' }}>
            <Text style={{ textTransform: 'uppercase', color: '#000' }}>Mis </Text>
            <Text style={{ textTransform: 'uppercase' }}>
              <Text style={{ color: '#C11326' }}>Favoritos</Text>
            </Text>
          </Text>
          <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 10, textAlign: 'center' }}>¡Aquí están los tragos que más te gustan!</Text>
          <Text style={styles.noFavoritesText}>Aún no tienes ningún trago en favoritos</Text>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' }}>
            <Text style={{ textTransform: 'uppercase', color: '#000' }}>Mis </Text>
            <Text style={{ textTransform: 'uppercase' }}>
              <Text style={{ color: '#C11326' }}>Favoritos</Text>
            </Text>
          </Text>
          <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 10, textAlign: 'center' }}>¡Aquí están los tragos que más te gustan!</Text>
          <View>
            {favoriteTragos.map((trago, index) => (
              <FavoritesCard
                key={index}
                trago={trago}
                onPressRemove={() => handleRemoveFavorite(trago)}
                onPressTragoDetail={() => handlePressTragoDetail(trago)}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red'
  },
});

export default FavoritesScreen;
