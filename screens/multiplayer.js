import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import io from 'socket.io-client';
import { useSettings } from '../settingsContext';
import CustomKeyboard from './keyboard';

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
  const [gameMode, setGameMode] = useState('endless');
  const [gameState, setGameState] = useState({});
  const [room, setRoom] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('gameUpdate', (game) => {
      setPlayers(Object.values(game.players));
      setGameState(game);
    });

    socket.on('roomsList', (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on('roomError', (message) => {
      Alert.alert('Error', message);
    });

    return () => {
      socket.off('gameUpdate');
      socket.off('roomsList');
      socket.off('roomError');
    };
  }, []);

  useEffect(() => {
    axios.get('http://192.168.1.4:3000/rooms')
      .then(response => setAvailableRooms(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleCreateRoom = () => {
    if (!username) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }
    const newRoom = `room-${Math.random().toString(36).substring(7)}`;
    setRoom(newRoom);
    socket.emit('createRoom', {
      username: username,
      room: newRoom,
      lang: language,
      difficulty: difficulty,
    });
    setIsPlayerSetup(true);
  };

  const handleJoinRoom = (roomName) => {
    if (!username) {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }
    const assignedColors = [];
    const initialPlayers = Array.from({ length: playerCount }, (_, index) => {
      let color;
      do {
        color = colors[Math.floor(Math.random() * colors.length)];
      } while (assignedColors.includes(color));
      assignedColors.push(color);

      return {
        id: socket.id, // use socket id as player id
        name: username,
        word: '',
        guess: '',
        attempts: [],
        wordDetails: {},
        showModal: false,
        score: 0,
        startTime: null,
        color: color,
      };
    });
    setPlayers(initialPlayers);
    setRoom(`room-${Math.random().toString(36).substring(7)}`);
    setRoom(roomName);
    socket.emit('joinRoom', {
      username: username,
      room: roomName,
    });
    
    setIsPlayerSetup(true);
  };

  const handleStartGame = () => {
   
    setIsPlayerSetup(true);
  };

  const handleGuess = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player.word || player.guess.length !== player.word.length) {
      Alert.alert('Invalid Guess', `Your guess must be ${player.word.length} letters long.`);
      return;
    }

    const updatedPlayers = players.map(p => {
      if (p.id === playerId) {
        const newAttempts = [...p.attempts, p.guess.toUpperCase()];
        const isCorrect = p.guess.toUpperCase() === p.word;
        let newScore = p.score;
        if (isCorrect || newAttempts.length >= 6) {
          fetchWordDetails(playerId);
          if (isCorrect) {
            newScore += 10;
            if (gameMode === 'wordSequenceRace') {
              axios.get(`http://192.168.1.4:3000/word?lang=${language}&difficulty=${difficulty}&pack=${wordPack}`)
                .then(response => {
                  setPlayers(players.map(player => player.id === playerId ? { ...player, word: response.data.word, guess: '', attempts: [], score: newScore } : player));
                })
                .catch(error => console.error(error));
            } else {
              Alert.alert('Congratulations!', 'You guessed the word!', [
                { text: 'OK', onPress: () => setPlayers(players.map(player => player.id === playerId ? { ...player, showModal: true, score: newScore } : player)) }
              ]);
            }
          } else {
            Alert.alert('Game Over', `The correct word was: ${p.word}`, [
              { text: 'OK', onPress: () => setPlayers(players.map(player => player.id === playerId ? { ...player, showModal: true } : player)) }
            ]);
          }
        }
        return { ...p, attempts: newAttempts, guess: '', score: newScore };
      }
      return p;
    });
    socket.emit('makeGuess', { guess: player.guess, room: room });

    setPlayers(updatedPlayers);
  };

  const fetchWordDetails = (playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player.word) return;

    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${player.word}`)
      .then(response => {
        const wordData = response.data[0];
        const details = {
          definition: wordData.meanings[0].definitions[0].definition,
          conjugations: 'Conjugations data',
          synonyms: wordData.meanings[0].definitions[0].synonyms.join(', '),
        };
        setPlayers(players.map(player => player.id === playerId ? { ...player, wordDetails: details } : player));
      })
      .catch(error => console.error(error));
  };

  const renderAttempt = ({ item, player }) => (
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

  const handleKeyPress = (key, playerId) => {
    setPlayers(players.map(player => player.id === playerId ? { ...player, guess: (player.guess.length < player.word.length ? player.guess + key : player.guess) } : player));
 console.log(players)
  };

  if (!isPlayerSetup) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Wordle Game</Text>
        <Text style={styles.subtitle}>Enter Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          style={styles.input}
        />
        <Text style={styles.subtitle}>Available Rooms</Text>
        {availableRooms.length > 0 ? (
          <FlatList
            data={availableRooms}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.roomButton} onPress={() => handleJoinRoom(item)}>
                <Text style={styles.roomButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        ) : (
          <Text style={styles.noRoomsText}>No available rooms</Text>
        )}
        <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
          <Text style={styles.buttonText}>Create Room</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wordle Game</Text>
      <View style={styles.playersContainer}>
        
        {players.map(player => (
        
          <View key={player.id} style={[styles.playerContainer, { borderColor: player.color, borderWidth: 2 }]}>
            <Text style={[styles.playerTitle, { color: player.color }]}>{player.name}</Text>
            <FlatList
              data={player.attempts}
              renderItem={({ item }) => renderAttempt({ item, player })}
              keyExtractor={(item, index) => `${player.id}-${index}`}
              style={styles.attemptsList}
            />
            <TextInput
              value={player.guess}
              onChangeText={(text) => {
                setPlayers(players.map(p => p.id === player.id ? { ...p, guess: text } : p));
              }}
              placeholder="Enter your guess"
              style={styles.input}
              maxLength={player.word?.length}
            />
            <TouchableOpacity style={styles.button} onPress={() => handleGuess(player.id)}>
              <Text style={styles.buttonText}>Submit Guess</Text>
            </TouchableOpacity>
            <CustomKeyboard onKeyPress={(key) => handleKeyPress(key, player.id)} language={language} />
            {/* <Modal
              visible={player.showModal}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Word Details</Text>
                  <Text style={styles.modalText}>Word: {player.word}</Text>
                  <Text style={styles.modalText}>Definition: {player.wordDetails.definition}</Text>
                  <Text style={styles.modalText}>Conjugations: {player.wordDetails.conjugations}</Text>
                  <Text style={styles.modalText}>Synonyms: {player.wordDetails.synonyms}</Text>
                  <TouchableOpacity style={styles.modalButton} onPress={() => setPlayers(players.map(p => p.id === player.id ? { ...p, showModal: false } : p))}>
                    <Text style={styles.modalButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal> */}
          </View>
        ))}
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
  roomButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
    width: '80%',
  },
  roomButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  noRoomsText: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  playersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  playerContainer: {
    flexBasis: '44%',
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
