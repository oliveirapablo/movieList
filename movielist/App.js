/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import axios from 'axios';

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  Modal,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  const apiUrl = 'http://www.omdbapi.com/?apikey=b577e7a5';
  const [state, setState] = useState({
    s: 'Escolher um filme...',
    results: [],
    selected: {},
  });

  const search = () => {
    axios(apiUrl + '&s=' + state.s).then(({data}) => {
      let results = data.Search;

      setState((prevState) => {
        return {...prevState, results: results};
      });
    });
  };

  const openPopup = (id) => {
    axios(apiUrl + '&i=' + id).then(({data}) => {
      let result = data;

      setState((prevState) => {
        return {...prevState, selected: result};
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Filmes</Text>
      <TextInput
        style={styles.seachBox}
        onChangeText={(text) =>
          setState((prevState) => {
            return {...prevState, s: text};
          })
        }
        onSubmitEditing={search}
        value={state.s}
      />
      <ScrollView style={styles.results}>
        {state.results.map((result) => (
          <TouchableHighlight
            key={result.imdbID}
            onPress={() => openPopup(result.imdbID)}>
            <View key={result.imdbID} style={styles.result}>
              <Image
                source={{uri: result.Poster}}
                style={styles.image}
                resizeMode="cover"
              />
              <Text style={styles.heading}>{result.Title}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={false}
        visible={typeof state.selected.Title !== 'undefined'}>
        <View style={styles.popup}>
          <Text style={styles.poptitle}>{state.selected.Title}</Text>
          <Text style={{marginBottom: 20}}>
            Avaliaçao: {state.selected.imdbRating}
          </Text>
          <Text>{state.selected.Plot}</Text>
        </View>
        <TouchableHighlight
          onPress={() =>
            setState((prevState) => {
              return {...prevState, selected: {}};
            })
          }>
          <Text style={styles.cloneBtn}>Fechar</Text>
        </TouchableHighlight>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcdce6',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
  },
  title: {
    color: '#223343',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  seachBox: {
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 30,
  },
  results: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
  },
  heading: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    padding: 20,
    backgroundColor: '#445565',
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  popup: {
    padding: 20,
  },
  poptitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  cloneBtn: {
    padding: 20,
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#2484C4',
  },
});

export default App;
