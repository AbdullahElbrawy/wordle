import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useSettings } from '../settingsContext';
import CustomKeyboard from './keyboard';

const colors = [
  '#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
];

export default function GameScreen() {
  const { language, difficulty, wordPack } = useSettings();
  const [player, setPlayer] = useState({
    id: 1,
    name: 'Player',
    word: '',
    guess: '',
    attempts: [],
    wordDetails: {},
    showModal: false,
    score: 0,
    startTime: null,
    color: colors[Math.floor(Math.random() * colors.length)]
  });
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);

  useEffect(() => {
    axios.get(`https://wordle-nine-gamma.vercel.app/word?lang=${language}&difficulty=${difficulty}&pack=${wordPack}`)
      .then(response => {
        setPlayer({ ...player, word: response.data.word });
      })
      .catch(error => console.error(error));
  }, []);

  const handleGuess = () => {
    if (!player.word || player.guess.length !== player.word.length) {
      Alert.alert('Invalid Guess', `Your guess must be ${player.word.length} letters long.`);
      return;
    }

    const newAttempts = [...player.attempts, player.guess.toUpperCase()];
    const isCorrect = player.guess.toUpperCase() === player.word;
    let newScore = player.score;
    if (isCorrect || newAttempts.length >= 6) {
      fetchWordDetails();
      if (isCorrect) {
        newScore += 10;
        Alert.alert('Congratulations!', 'You guessed the word!', [
          { text: 'OK', onPress: () => setPlayer({ ...player, showModal: true, score: newScore }) }
        ]);
      } else {
        Alert.alert('Game Over', `The correct word was: ${player.word}`, [
          { text: 'OK', onPress: () => setPlayer({ ...player, showModal: true }) }
        ]);
      }
    }

    setPlayer({ ...player, attempts: newAttempts, guess: '', score: newScore });
  };

  const fetchWordDetails = () => {
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${player.word}`)
      .then(response => {
        const wordData = response.data[0];
        const details = {
          definition: wordData.meanings[0].definitions[0].definition,
          conjugations: 'Conjugations data',
          synonyms: wordData.meanings[0].definitions[0].synonyms.join(', '),
        };
        setPlayer({ ...player, wordDetails: details });
      })
      .catch(error => console.error(error));
  };

  const renderAttempt = ({ item }) => (
    <View style={styles.attemptRow} key={item}>
      {item.split('').map((letter, index) => (
        <View key={index} style={[
          styles.letterBox,
          player.word[index] === letter ? styles.correctLetter : player.word.includes(letter) ? styles.misplacedLetter : styles.incorrectLetter
        ]}>
          <Text style={styles.letter}>{letter}</Text>
        </View>
      ))}
    </View>
  );

  const handleKeyPress = (key) => {
    setPlayer({ ...player, guess: (player.guess.length < player.word.length ? player.guess + key : player.guess) });
  };

  if (!isPlayerSetup) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Wordle Game</Text>
        <Text style={styles.subtitle}>Enter Username</Text>
        <TextInput
          value={player.name}
          onChangeText={(text) => setPlayer({ ...player, name: text })}
          placeholder="Username"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={() => setIsPlayerSetup(true)}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wordle Game</Text>
      <View style={styles.playerContainer}>
        <Text style={[styles.playerTitle, { color: player.color }]}>{player.name}</Text>
        <FlatList
          data={player.attempts}
          renderItem={({ item }) => renderAttempt({ item })}
          keyExtractor={(item, index) => `${player.id}-${index}`}
          style={styles.attemptsList}
        />
        <TextInput
          value={player.guess}
          onChangeText={(text) => setPlayer({ ...player, guess: text })}
          placeholder="Enter your guess"
          style={styles.input}
          maxLength={player.word?.length}
        />
        <TouchableOpacity style={styles.button} onPress={handleGuess}>
          <Text style={styles.buttonText}>Submit Guess</Text>
        </TouchableOpacity>
        <CustomKeyboard onKeyPress={handleKeyPress} language={language} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#FFF',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
  },
  playerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  attemptsList: {
    width: '100%',
    marginBottom: 20,
  },
  attemptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  letterBox: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 4,
  },
  correctLetter: {
    backgroundColor: '#6aaa64',
  },
  misplacedLetter: {
    backgroundColor: '#c9b458',
  },
  incorrectLetter: {
    backgroundColor: '#787c7e',
  },
  letter: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
