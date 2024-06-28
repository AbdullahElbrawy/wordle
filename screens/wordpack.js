import React, { useState, useEffect } from 'react';
import { View, Text, Picker, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function WordPackScreen({ navigation }) {
  const [pack, setPack] = useState('animals');
  const [words, setWords] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.1.100:30000/wordPack?pack=${pack}`)
      .then(response => setWords(response.data))
      .catch(error => console.error(error));
  }, [pack]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Word Pack</Text>
      <Picker
        selectedValue={pack}
        style={styles.picker}
        onValueChange={(itemValue) => setPack(itemValue)}
      >
        <Picker.Item label="Animals" value="animals" />
        <Picker.Item label="Technology" value="technology" />
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Countries" value="countries" />
        {/* Add more packs */}
      </Picker>
      <Button title="Start Game" onPress={() => navigation.navigate('Game', { pack })} />
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
  picker: {
    height: 50,
    width: 150,
    marginBottom: 20,
  },
});
