import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Modal, ScrollView } from 'react-native';
import io from 'socket.io-client';
import { Picker } from '@react-native-picker/picker';
import { useSettings } from '../settingsContext';
import CustomKeyboard from './keyboard'; // Ensure you have a CustomKeyboard component

const socket = io('http://192.168.1.4:3000');

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
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([]);
  const [isPlayerSetup, setIsPlayerSetup] = useState(false);
  const [gameMode, setGameMode] = useState('endless'); // Default game mode
  const [gameState, setGameState] = useState({});

  useEffect(() => {
    socket.on('gameUpdate', (game) => {
      setGameState(game);
    });

    return () => {
      socket.off('gameUpdate');
    };
  }, []);

  useEffect(() => {
    if (isPlayerSetup) {
      socket.emit('joinGame', {
        username: `Player ${socket.id}`,
        lang: language,
        difficulty: difficulty,
      });
    }
  }, [isPlayerSetup, language, difficulty]);

  const handleStartGame = () => {
    setIsPlayerSetup(true);
  };

  const handleGuess = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (player.guess.length !== gameState.word.length) {
      Alert.alert('Invalid Guess', `Your guess must be ${gameState.word.length} letters long.`);
      return;
    }

    socket.emit('makeGuess', { guess: player.guess, lang: language });
  };

  const handleKeyPress = (key, playerId) => {
    setPlayers(players.map(player => player.id === playerId ? { ...player, guess: (player.guess.length < gameState.word.length ? player.guess + key : player.guess) } : player));
  };

  if (!isPlayerSetup) {
    return (
      <View style={styles.containerIntro}>
        <Text style={styles.title}>Wordle Game</Text>
        <Text style={styles.subtitle}>Select Number of Players</Text>
        <Picker
          selectedValue={playerCount}
          style={styles.picker}
          onValueChange={(itemValue) => setPlayerCount(itemValue)}
        >
          {Array.from({ length: 30 }, (_, i) => i + 2).map(num => (
            <Picker.Item key={num} label={`${num} Players`} value={num} />
          ))}
        </Picker>
        <Text style={styles.subtitle}>Select Game Mode</Text>
        <Picker
          selectedValue={gameMode}
          style={styles.picker}
          onValueChange={(itemValue) => setGameMode(itemValue)}
        >
          <Picker.Item label="Endless" value="endless" />
          <Picker.Item label="Timed" value="timed" />
          <Picker.Item label="Word Sequence Race" value="wordSequenceRace" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleStartGame}>
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wordle Game</Text>
      <View style={styles.playersContainer}>
        {Object.keys(gameState.players || {}).map(playerId => {
          const player = gameState.players[playerId];
          return (
            <View key={playerId} style={[styles.playerContainer, { borderColor: colors[playerId % colors.length], borderWidth: 2 }]}>
              <Text style={[styles.playerTitle, { color: colors[playerId % colors.length] }]}>{player.username}</Text>
              <FlatList
                data={player.attempts}
                renderItem={({ item }) => renderAttempt({ item, player })}
                keyExtractor={(item, index) => `${playerId}-${index}`}
                style={styles.attemptsList}
              />
              <TextInput
                value={player.guess}
                onChangeText={(text) => setPlayers(players.map(p => p.id === playerId ? { ...p, guess: text } : p))}
                placeholder="Enter your guess"
                style={styles.input}
                maxLength={gameState.word.length}
              />
              <TouchableOpacity style={styles.button} onPress={() => handleGuess(playerId)}>
                <Text style={styles.buttonText}>Submit Guess</Text>
              </TouchableOpacity>
              <CustomKeyboard onKeyPress={(key) => handleKeyPress(key, playerId)} language={language} />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#6aaa64',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
