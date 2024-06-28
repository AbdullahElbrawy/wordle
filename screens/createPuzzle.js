import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function CreatePuzzleScreen() {
  const [puzzle, setPuzzle] = useState('');

  const handleSubmit = () => {
    axios.post('https://wordle-nine-gamma.vercel.app/createPuzzle', { username: 'User', puzzle })
      .then(response => {
        if (response.data.success) {
          Alert.alert('Puzzle created successfully!');
        }
      })
      .catch(error => {
        Alert.alert('Error creating puzzle', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={puzzle}
        onChangeText={setPuzzle}
        placeholder="Enter your puzzle"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Puzzle</Text>
      </TouchableOpacity>
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
