import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function DailyChallengeScreen() {
  const [word, setWord] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [input, setInput] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.100:30000/daily?lang=en')
      .then(response => setWord(response.data.word))
      .catch(error => console.error(error));

    axios.get('http://192.168.1.100:30000/leaderboard')
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = () => {
    if (input.length === word.length) {
      setAttempts([...attempts, input]);
      setInput('');
      if (input === word) {
        Alert.alert('Congratulations!', 'You guessed the word!');
        axios.post('http://192.168.1.100:30000/leaderboard', { username: 'User', score: attempts.length + 1 })
          .catch(error => console.error(error));
      }
    } else {
      Alert.alert('Invalid input length');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Challenge</Text>
      {attempts.map((attempt, index) => (
        <Text key={index} style={styles.attempt}>{attempt}</Text>
      ))}
      <TextInput
        value={input}
        onChangeText={setInput}
        maxLength={word.length}
        placeholder="Enter your guess"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.map((entry, index) => (
        <Text key={index}>{entry.username}: {entry.score}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  attempt: {
    fontSize: 18,
    marginVertical: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: 200,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
