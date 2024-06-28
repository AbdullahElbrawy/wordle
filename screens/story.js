// StoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function StoryScreen() {
  const [story, setStory] = useState('');
  const [part, setPart] = useState(1);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get(`https://wordle-nine-gamma.vercel.app/story?id=1&part=${part}`)
      .then(response => setStory(response.data))
      .catch(error => console.error(error));
  }, [part]);

  const handleSubmit = () => {
    if (input.toUpperCase() === story.word) {
      setPart(part + 1);
      setInput('');
    } else {
      Alert.alert('Wrong guess, try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.story}>{story.story}</Text>
      <TextInput
        value={input}
        onChangeText={setInput}
        maxLength={story.word ? story.word.length : 0}
        placeholder="Enter your guess"
        style={styles.input}
      />
       
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
  story: {
    fontSize: 18,
    margin: 20,
    textAlign: 'center',
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
    marginHorizontal: 'auto',
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
