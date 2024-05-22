import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import SearchBar from '../components/SearchBar';
import data from '../data/api.json';
import SearchTragoCard from '../components/SearchTragoCard';
import ExploreTragoCard from '../components/ExploreTragoCard';



const windowWidth = Dimensions.get('window').width;

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTragos, setFilteredTragos] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [favoriteTragos, setFavoriteTragos] = useState([]);

  useEffect(() => {
    // Realizar la búsqueda solo si hay al menos tres caracteres en la barra de búsqueda
    if (searchQuery.length >= 3) {
      // Filtrar tragos por nombre
      const filteredByName = data.filter(trago =>
        trago.nombre.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Actualizar el estado con los tragos filtrados
      setFilteredTragos(filteredByName);

      // Mostrar mensaje si no hay resultados
      setNoResults(filteredByName.length === 0);
    } else {
      // Si la barra de búsqueda tiene menos de tres caracteres, no filtramos los tragos
      setFilteredTragos([]);
      setNoResults(false);
    }
  }, [searchQuery]);

  //Función para agregar a favoritos
  const addToFavorites = (trago) => {
    setFavoriteTragos([...favoriteTragos, trago]);
  }
  // Función para manejar cambios en el texto de búsqueda
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Función para manejar la acción de enviar la búsqueda
  const handleSubmitSearch = () => {
    // Puedes realizar acciones adicionales aquí si lo deseas
    // Por ejemplo, podrías realizar una búsqueda remota con la cadena de búsqueda actual
  };

  // Función para filtrar los tragos por sabor dulce
  const filterBySweet = () => {
    const sweetTragos = data.filter(trago => trago.sabor.toLowerCase() === 'dulce');
    return sweetTragos;
  };

  // Función para filtrar los tragos por sabor amargo
  const filterByAmargo = () => {
    const amargoTragos = data.filter(trago => trago.sabor.toLowerCase() === 'amargo');
    return amargoTragos;
  };

  // Función para filtrar los tragos con cerveza
  const filterWithBeer = () => {
    const beerTragos = data.filter(trago =>
      trago.ingredientes.some(ingrediente => ingrediente.nombre.toLowerCase().includes('cerveza'))
    );
    return beerTragos;
  };

    // Función para filtrar los tragos con gin
    const filterWithGin = () => {
        const ginTragos = data.filter(trago =>
          trago.ingredientes.some(ingrediente => ingrediente.nombre.toLowerCase().includes('gin'))
        );
        return ginTragos;
      };
    // Función para filtrar los tragos con gin
    const filterWithWhisky = () => {
      const whiskyTragos = data.filter(trago =>
        trago.ingredientes.some(ingrediente => ingrediente.nombre.toLowerCase().includes('whisk'))
      );
      return whiskyTragos;
    };
    
    // Función para filtrar los tragos para el domingo
    const filterForSunday = () => {
        const sundayTragos = data.filter(trago =>
            trago.ingredientes.some(ingrediente => ingrediente.nombre.toLowerCase().includes('fernet') 
            || ingrediente.nombre.toLowerCase().includes('aperol') 
            || ingrediente.nombre.toLowerCase().includes('campari','jugo de naranja') 
            || ingrediente.nombre.toLowerCase().includes('tónica') )
        );
        return sundayTragos;
        };

    // Función para filtrar los tragos bien argentinos
    const filterByArgentina = () => {
        const tragosArgentino = data.filter(trago => trago.categoria.toLowerCase() === 'argentina');
        return tragosArgentino;
      };
  

  return (
    <ScrollView style={{ flex: 1, marginTop: 50 }}>
      {/* Barra de búsqueda */}
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        onSubmit={handleSubmitSearch}
      />

      {/* Resultados de la búsqueda */}
      {searchQuery.length >= 3 && (
        <>
          {noResults ? (
            <Text style={{ color: 'red', padding: 20 }}>No se encontraron resultados</Text>
          ) : (
            <ScrollView style={{marginTop: 20}}>
            {filteredTragos.map((item) => (
              <SearchTragoCard key={item.id.toString()} trago={item} />
            ))}
          </ScrollView>
          )}
        </>
      )}

      {/* Sección de "¿Ganas de algo dulce?" */}
      <View style={{ marginTop: 50 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' }}>
        <Text style={{ textTransform: 'uppercase', color: '#000' }}>¿Ganas de </Text>
        <Text style={{ textTransform: 'uppercase' }}>
          <Text style={{ color: '#C11326' }}>algo dulce?</Text>
        </Text>
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 10, textAlign: 'center' }}>Desliza hacia la izquierda para ver las mejores opciones</Text>
      <FlatList
        horizontal
        data={filterBySweet()}
        renderItem={({ item }) => <ExploreTragoCard trago={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>

      {/* Sección de "Amargura total" */}
      <View style={{ marginVertical: 20 }}>
      <Text style={{ textTransform: 'uppercase' ,color: '#C11326',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 5, marginLeft:20, textAlign: 'left' }}>
        amargura total
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 10, marginLeft:20, textAlign: 'left' }}>Desliza hacia la izquierda para ver las mejores opciones</Text>
        <FlatList
          horizontal
          data={filterByAmargo()}
          renderItem={({ item }) => <ExploreTragoCard trago={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Sección de "Para los cerveceros" */}
      <View style={{ marginVertical: 20 }}>
      <Text style={{ textTransform: 'uppercase' ,color: '#C11326',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 5, marginRight:20, textAlign: 'right' }}>
        para los cerveceros
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 10, marginRight:20, textAlign: 'right' }}>Desliza hacia la izquierda para ver las mejores opciones para tomar con cerveza</Text>
        <FlatList
          horizontal
          data={filterWithBeer()}
          renderItem={({ item }) => <ExploreTragoCard trago={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

           {/* Sección de "Gin" */}
           <View style={{ marginVertical: 20 }}>
           <Text style={{ textTransform: 'uppercase' ,color: 'black',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 5, marginLeft:20, textAlign: 'left' }}>
        ¿Te aburriste del Gin Tonic?
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: '#C11326', marginBottom: 10, marginLeft:20, textAlign: 'left' }}>Desliza hacia la izquierda para ver todos los tragos que podes hacer con gin</Text>
        <FlatList
          horizontal
          data={filterWithGin()}
          renderItem={({ item }) => <ExploreTragoCard trago={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

        {/* Sección de "Ideal para el domingo" */}
                 <View style={{ marginVertical: 20 }}>
                 <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' }}>
        <Text style={{ textTransform: 'uppercase', color: '#000' }}>Ideal para  </Text>
        <Text style={{ textTransform: 'uppercase' }}>
          <Text style={{ color: '#C11326' }}>el domingo</Text>
        </Text>
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: 'black', marginBottom: 10, textAlign: 'center' }}>Desliza hacia la izquierda para ver nuestras sugerencias para el domingo</Text>
        <FlatList
          horizontal
          data={filterForSunday()}
          renderItem={({ item }) => <ExploreTragoCard trago={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

              {/* Sección de "Tragos bien argentinos" */}
      <View style={{ marginVertical: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' }}>
        <Text style={{ textTransform: 'uppercase', color: '#70A7D8' }}>Tragos  </Text>
        <Text style={{ textTransform: 'uppercase' }}>
          <Text style={{ color: '#EEAE0E' }}>bien</Text>
        </Text>
        <Text style={{ textTransform: 'uppercase', color: '#70A7D8' }}>  Argentinos  </Text>
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: '#70A7D8', marginBottom: 10, textAlign: 'center' }}>Desliza hacia la izquierda para ver los tragos originarios de Argentina</Text>

        <FlatList
          horizontal
          data={filterByArgentina()}
          renderItem={({ item }) => <ExploreTragoCard trago={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 10 }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Sección de "Tragos con whisky" */}
      <View style={{ marginVertical: 20 }}>
      <Text style={{ textTransform: 'uppercase' ,color: 'black',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 5, marginRight:20, textAlign: 'right' }}>
        ¿y con whisky?
      </Text>
      <Text style={{ textTransform: 'uppercase', fontSize: 12, fontWeight: 'bold', color: '#C11326', marginBottom: 10, marginRight:20, textAlign: 'right' }}>Desliza hacia la izquierda para ver todos los tragos que podes hacer con whisky</Text>

          <FlatList
            horizontal
            data={filterWithWhisky()}
            renderItem={({ item }) => <ExploreTragoCard trago={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            showsHorizontalScrollIndicator={false}
          />
      </View>
    </ScrollView>
  );
};

export default ExploreScreen;
