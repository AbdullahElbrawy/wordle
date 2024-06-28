import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,Alert } from 'react-native';

export default function WordInput({ wordLength, onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.length === wordLength) {
      onSubmit(input.toUpperCase());
      setInput('');
    } else {
      Alert.alert('Invalid input', `Please enter a word with ${wordLength} letters.`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={input}
        onChangeText={setInput}
        style={styles.input}
        placeholder="Enter your guess"
        autoCapitalize="characters"
        maxLength={wordLength}
      />
      <Button title="Submit" onPress={handleSubmit}  style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#6200ea',
    marginBottom: 20,
    width: '80%',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'center',
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
