import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useSettings } from '../settingsContext'; // Correct the import path for your context
import io from 'socket.io-client';

const socket = io('https://wordle-nine-gamma.vercel.app/'); // Update with your server address

export default function PuzzleScreen() {
  const { language, difficulty, wordPack } = useSettings();
  const [word, setWord] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [guess, setGuess] = useState('');
  const [players, setPlayers] = useState({});
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    axios.get(`https://wordle-nine-gamma.vercel.app/word?lang=${language}&difficulty=${difficulty}&pack=${wordPack}`)
      .then(response => setWord(response.data.word))
      .catch(error => console.error(error));

    socket.emit('joinGame', { username: 'Player', lang: language });

    socket.on('gameUpdate', (game) => {
      setWord(game.word);
      setPlayers(game.players);
    });

    socket.on('guessFeedback', (message) => {
      Alert.alert(message);
    });

    return () => {
      socket.off('gameUpdate');
      socket.off('guessFeedback');
    };
  }, [language, difficulty, wordPack]);

  const handleGuess = () => {
    if (guess.toUpperCase() === word) {
      Alert.alert('Congratulations!', 'You guessed the word!');
      setGameOver(true);
      socket.emit('makeGuess', { guess, lang: language });
    } else if (attempts.length >= 5) {
      Alert.alert('Game Over', `The correct word was: ${word}`);
      setGameOver(true);
    } else {
      setAttempts([...attempts, guess.toUpperCase()]);
      socket.emit('makeGuess', { guess, lang: language });
      setGuess('');
    }
  };

  const renderAttempt = ({ item }) => (
    <View style={styles.attemptRow}>
      {item.split('').map((letter, index) => (
        <View key={index} style={[
          styles.letterBox,
          word[index] === letter ? styles.correctLetter : word.includes(letter) ? styles.misplacedLetter : styles.incorrectLetter
        ]}>
          <Text style={styles.letter}>{letter}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiplayer Puzzle Game</Text>
      <FlatList
        data={attempts}
        renderItem={renderAttempt}
        keyExtractor={(item, index) => index.toString()}
        style={styles.attemptsList}
      />
      {!gameOver && (
        <>
          <TextInput
            value={guess}
            onChangeText={setGuess}
            placeholder="Enter your guess"
            style={styles.input}
            maxLength={word.length}
          />
          <TouchableOpacity style={styles.button} onPress={handleGuess}>
            <Text style={styles.buttonText}>Submit Guess</Text>
          </TouchableOpacity>
        </>
      )}
      <View style={styles.playersContainer}>
        {Object.keys(players).map((id) => (
          <Text key={id} style={styles.player}>
            {players[id].username}: {players[id].score}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  attemptsList: {
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    width: '80%',
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#6aaa64',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playersContainer: {
    marginTop: 20,
    width: '100%',
  },
  player: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    color: '#FFF',
  },
});
