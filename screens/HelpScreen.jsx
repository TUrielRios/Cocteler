import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

const faqData = [
  {
    title: '¿Qué es el método batido?',
    content: 'El método batido es una técnica de preparación de cócteles que implica agitar vigorosamente los ingredientes en una coctelera con hielo, generalmente para mezclar bien los ingredientes y enfriar la mezcla.',
  },
  {
    title: '¿Qué es el método mezclado?',
    content: 'El método mezclado es una técnica de preparación de cócteles que implica simplemente verter y mezclar los ingredientes en un vaso o recipiente, sin agitar ni revolver vigorosamente.',
  },
  {
    title: '¿Qué significa receta IBA?',
    content: 'La receta IBA (International Bartenders Association) es una receta de cóctel reconocida internacionalmente que cumple con los estándares establecidos por la asociación para ese tipo particular de cóctel.',
  },
  {
    title: 'Si no tengo una coctelera, ¿qué uso?',
    content: 'Si no tienes una coctelera, puedes usar un frasco con tapa hermética o dos vasos para agitar tus cócteles.',
  },
  {
    title: '¿Cómo mido los ml si no tengo un jigger?',
    content: 'Puedes usar una cuchara medidora o estimar utilizando una escala de volumen en la botella de licor. También puedes convertir las medidas utilizando una tabla de equivalencias.',
  },
  {
    title: '¿Cuánto es 3 cl?',
    content: '3 cl equivale a 30 ml, que es aproximadamente una onza líquida.',
  },
  {
    title: '¿Quién desarrolló la aplicación y cómo puedo contactarme con él?',
    content: 'La aplicación fue desarrollada por Tiziano Ríos. Puedes contactarte con él siguiendo este link.',
  },
];

export default class HelpScreen extends Component {
  state = {
    activeSections: [],
  };

  _renderHeader = (section, _, isActive) => {
    return (
      <View style={[styles.header, isActive ? styles.active : styles.inactive]}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = (section) => {
    return (
      <View style={styles.content}>
        <Text style={styles.contentText}>{section.content}</Text>
        {/* Agregamos un enlace para contactar al desarrollador */}
        {section.title === '¿Quién desarrolló la aplicación y cómo puedo contactarme con él?' && (
          <Text style={styles.contactLink} onPress={() => Linking.openURL('mailto:riostiziano6@gmail.com')}>Contactar al desarrollador</Text>
        )}
      </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  render() {
    return (
      <View style={styles.container}>
              <Text style={{ textTransform: 'uppercase' ,color: '#C11326',fontSize: 18, fontWeight: '800', letterSpacing: -0.5, marginBottom: 5,marginTop:20, textAlign: 'center' }}>
        ¿Buscas ayuda?
      </Text>
      <Text style={{ textTransform: 'uppercase' ,color: 'black',fontSize: 16, fontWeight: '800', letterSpacing: -0.5, marginBottom: 20, textAlign: 'center' }}>
        preguntas frecuentes
      </Text>
        <Accordion
          sections={faqData}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
        />
        <Text style={{textAlign: 'center', fontSize:10, position: 'absolute', bottom:20, justifyContent:'center', alignSelf: 'center'}}>Copyright © 2024, Todos los derechos reservados</Text>
        <Text style={{textAlign: 'center', fontSize:10, position: 'absolute', bottom:5, justifyContent:'center', alignSelf: 'center'}}>Cócteler</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },
  contentText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#1c1c1c'
  },
  active: {
    backgroundColor: '#dcdcdc',
  },
  inactive: {
    backgroundColor: '#f9f9f9',
  },
  contactLink: {
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
