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
  FlatList,
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
    s: '',
    results: [],
    selected: {},
  });
  const [modalVisible, setModalVisible] = useState(false);

  const [myMovies, setMyMovies] = useState([]);

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

  const saveMovie = (id) => {
    axios(apiUrl + '&i=' + id).then(({data}) => {
      let result = data;
      console.log('MY MOVIES', myMovies);
      setMyMovies([...myMovies, data]);
    });
  };

  function deleteMovie(id) {
    setMyMovies((movie) => movie.filter((item) => item.imdbID !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Filmes</Text>
      <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text style={styles.textStyle}>Minha Lista</Text>
      </TouchableHighlight>
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
          <Image
            source={{uri: state.selected.Poster}}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={{marginBottom: 20}}>
            Avaliaçao: {state.selected.imdbRating}
          </Text>
          <Text>{state.selected.Plot}</Text>
        </View>
        {/* {myMovies && myMovies.filter((item) => item.imdbID === state.imdbID) && (
          <TouchableHighlight
            style={{...styles.openButton, backgroundColor: '#E02041'}}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Text style={styles.textStyle}>Deletar</Text>
          </TouchableHighlight>
        )} */}

        <TouchableHighlight
          onPress={() =>
            setState((prevState) => {
              return {...prevState, selected: {}};
            })
          }>
          <Text style={styles.cloneBtn}>Fechar</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => saveMovie(state.selected.imdbID)}>
          <Text style={styles.saveBtn}>Salvar</Text>
        </TouchableHighlight>
      </Modal>

      <Modal animationType="fade" transparent={false} visible={modalVisible}>
        <View style={styles.popup}>
          {console.log(myMovies)}

          <FlatList
            data={myMovies}
            renderItem={({item}) => (
              <TouchableHighlight
                key={item.imdbID}
                onPress={() => openPopup(item.imdbID)}>
                <View style={styles.popup}>
                  <Text style={styles.poptitle}>{item.Title}</Text>
                  <Image
                    source={{uri: item.Poster}}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={() => String(Math.random())}
          />
        </View>

        <TouchableHighlight
          style={{...styles.openButton, backgroundColor: '#2196F3'}}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}>
          <Text style={styles.textStyle}>Fechar</Text>
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
    padding: 10,
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#2484C4',
    width: 200,
    height: 50,
    marginLeft: 100,
    borderRadius: 20,
  },
  saveBtn: {
    padding: 10,
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#77DD77',
    width: 200,
    height: 50,
    marginTop: 10,
    marginLeft: 100,

    borderRadius: 20,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#77D7',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  Myresults: {
    flex: 1,
    backgroundColor: '#6653',
  },
});

export default App;
