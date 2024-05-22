import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import Icon from 'react-native-vector-icons/Ionicons'; // o cualquier otro set de iconos


// Objeto que mapea el texto de la cristalería a la ruta de la imagen correspondiente
const cristaleriaImages = {
  'jarra': require('../assets/images/jarra.png'),
  'cava flauta': require('../assets/images/cava_flauta.png'),
  'copa flauta': require('../assets/images/cava_flauta.png'),
  'cocktail': require('../assets/images/copa_cocktail.png'),
  'copa cocktail grande': require('../assets/images/copa_cocktail.png'),
  'copa cocktail': require('../assets/images/copa_cocktail.png'),
  'copa de vino': require('../assets/images/copa_vino.png'),
  'copa de vino o flauta': require('../assets/images/copa_vino.png'),
  'copa goblet': require('../assets/images/copa_goblet.png'),
  'copa martini': require('../assets/images/copa_cocktail.png'),
  'copa sparkling': require('../assets/images/cava_flauta.png'),
  'copa': require('../assets/images/copa.png'),
  'flauta': require('../assets/images/cava_flauta.png'),
  'flauta larga': require('../assets/images/cava_flauta.png'),
  'highball': require('../assets/images/highball.png'),
  'higball': require('../assets/images/highball.png'),
  'long drink': require('../assets/images/highball.png'),
  'vazo long drink': require('../assets/images/highball.png'),
  'vazo alto': require('../assets/images/highball.png'),
  'vaso alto': require('../assets/images/highball.png'),
  'vazo hig-ball': require('../assets/images/highball.png'),
  'old fashioned': require('../assets/images/old_fashioned.png'),
  'vaso especial': require('../assets/images/old_fashioned.png'),
  'sour': require('../assets/images/copa_cocktail.png'),
  'sours': require('../assets/images/copa_cocktail.png'),
  'tumbler': require('../assets/images/tumbler.png'),
  'tumbler pequeño': require('../assets/images/tumbler.png'),
  'vazo tumbler': require('../assets/images/tumbler.png'),
  'vazo tumbler mediano': require('../assets/images/tumbler.png'),
};

const TragoDetail = ({ route, navigation }) => {
  const { trago } = route.params;
  const [liked, setLiked] = useState(false); // Estado para mantener el estado de "like"
  // Estado para controlar la visibilidad de la guía de medidas
  const [mostrarGuia, setMostrarGuia] = useState(false);

  useEffect(() => {
    const isLiked = route.params?.isLiked || false;
    setLiked(isLiked);
  }, [route.params?.isLiked]);
  

  const handleLike = () => {
    if (!liked) {
      const { favoriteTragos } = route.params || { favoriteTragos: [] }; // Obtener la lista de favoritos de la ruta o establecer una lista vacía si no está presente
      const isDuplicate = favoriteTragos && favoriteTragos.some(item => item.nombre === trago.nombre); // Verificar si el trago ya está en favoritos
      if (!isDuplicate) {
        navigation.navigate('Favorites', { trago, isLiked: true });
      }
    } else {
      navigation.setParams({ removeFavorite: trago });
    }
    setLiked(prevLiked => !prevLiked); // Actualizar el estado utilizando la función de actualización del estado
  };
  


  // Función para obtener la imagen de la cristalería
  const getCristaleriaImage = (cristaleria) => {
    const key = cristaleria.toLowerCase();
    return cristaleriaImages[key] || null;
  };

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


  return (
    <ScrollView style={styles.container}>
      
              <ImageBackground 
        source={require('../assets/images/bannerimg.jpg')} 
        style={styles.backgroundImage}
        
      >
        <LinearGradient 
          colors={['rgba(40,40,40,0.9)', 'rgba(0,0,0,0)']} 
          style={styles.gradient} 
        />
            <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name='arrow-back' size={30} color='red' style={{backgroundColor: 'white', position: 'absolute', top: 80, right:130}} />
    </TouchableOpacity>
      <View style={[styles.tragoContainer,saborStyles, {
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.9, 
        shadowRadius: 4,
      }]}>
        <Image 
          source={{ uri: trago.foto }}   
          style={[styles.image, { 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.9, 
            shadowRadius: 4,
            borderRadius: 50
          }]} 
        />
      </View>


        <View style={styles.content}>
          <Text style={[styles.nombre, saborStyles]}>{trago.nombre}</Text>
          <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleLike}>
            <FontAwesomeIcon icon={faHeart} style={[styles.icon, liked ? { color: 'red' } : null]} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailSection}>
          <Text style={{ textTransform: 'uppercase' ,color: 'black',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 20, textAlign: 'center' }}>
       ¿como hacerlo?
      </Text>
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                
                {/* Renderización condicional de la imagen de la cristalería */}
                <Image 
                  source={getCristaleriaImage(trago.cristaleria)} 
                  style={styles.cristaleriaImage} 
                />
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                
                <Text style={styles.text1}>{trago.metodo}</Text>
              </View>
              <View style={styles.detailColumn}>
                
                <Text style={[styles.text1, saborStyles]}>{trago.sabor}</Text>
              </View>
            </View>
            <View style={styles.ingredientsContainer}>
              <ScrollView>
              {trago.ingredientes.map((ingrediente, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Text style={styles.ingredientStep}>{index + 1}</Text>
              <View style={styles.ingredientDetails}>
                <Text style={styles.ingredientName}>{ingrediente.nombre}</Text>
                <Text style={styles.ingredientQuantity}>
                  {typeof ingrediente.cantidad === 'number' ? (
                    ingrediente.cantidad > 200 ? `${ingrediente.cantidad} g` : `${ingrediente.cantidad} ${ingrediente.cantidad > 12 ? 'ml' : 'cl'}`
                  ) : (
                    ingrediente.cantidad // Mostrar el string directamente si es un string
                  )}
                </Text>
              </View>
            </View>
          ))}
                  {/* Texto para mostrar y ocultar la guía */}
                  <TouchableOpacity onPress={() => setMostrarGuia(!mostrarGuia)}>
          <Text style={styles.guiaText}>{mostrarGuia ? 'Ocultar guía' : 'Guía de medidas'}</Text>
        </TouchableOpacity>

        {/* Guía de medidas */}
        {mostrarGuia && (
          <View style={styles.guiaContainer}>
            <Text style={styles.guiaContent}>1 cl = 10 ml</Text>
            <Text style={styles.guiaContent}>1 oz = 30 ml</Text>
          </View>
        )}

              </ScrollView>
            </View>
            <View style={{flexDirection: 'column', width:'100%', justifyContent:'space-between', alignItems:'center'}}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <Text style={{ textTransform: 'uppercase', color: 'black', fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginTop: 0, textAlign: 'center' }}>
                Decoración
              </Text>
              {trago.decoracion ? (
                <Text style={styles.text}>{trago.decoracion}</Text>
              ) : (
                <Text style={styles.text}>No lleva una decoración específica</Text>
              )}
            </View>

              <View style={{flexDirection:'column', width: '100%'}}>
                  <Text style={{ textTransform: 'uppercase' ,color: 'black',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginTop: 20, textAlign: 'center' }}>
                    Observaciones
                  </Text>
                  <Text style={styles.text}>{trago.observaciones}</Text>
              </View>
            </View>

          </View>

        </View>
        </ImageBackground>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    height: '105%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tragoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 200,
    borderRadius: 500,
    marginTop:50
  },
  tragoContainer2: {
    backgroundColor: 'white'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    borderRadius: 10,
  },
  content: {
    paddingHorizontal: 0,
    paddingTop: 20,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
    backgroundColor: 'pink',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 10,
  },
  icon: {
    color: '#fff',
    fontSize: 20,
  },

  detailSection: {
    justifyContent:'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    margin: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  text1: {
    fontSize: 14,
    textTransform:'uppercase',
    marginBottom: 0,
    color: '#333',
    lineHeight: 24,
    padding: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center'
  },
  cristaleriaImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientStep: {
    width: 30,
    fontWeight: 'bold',
    marginRight: 10,
    textAlign: 'center',
  },

  ingredientDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
  ingredientName: {
    flex: 1,
    fontWeight: 'bold',

    color: '#333',
    textTransform: 'lowercase', // Convierte todo el texto a minúsculas
    textTransform: 'capitalize' // Luego convierte la primera letra de cada palabra a mayúscula
},

  ingredientQuantity: {
    color: '#666',
  },
  guiaText: {
    color: 'darkblue',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  guiaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },

  guiaContent: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 5,
    borderWidth: 1, 
  },
});

export default TragoDetail;
