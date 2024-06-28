import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WordDisplay({ word, attempts, revealedLetters, incorrectLetters }) {
  return (
    <View style={styles.container}>
      <View style={styles.wordContainer}>
        {word.split('').map((letter, index) => (
          <Text key={index} style={styles.letter}>
            {revealedLetters.includes(index) || attempts.includes(word) ? letter : '_'}
          </Text>
        ))}
      </View>
      <Text style={styles.incorrectLetters}>
        Incorrect Letters: {incorrectLetters.join(', ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  letter: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  incorrectLetters: {
    fontSize: 16,
    color: 'red',
  },
    button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'center',
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
