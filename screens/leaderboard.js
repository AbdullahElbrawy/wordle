import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.1.100:30000/leaderboard')
      .then(response => setLeaderboard(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {leaderboard.map((entry, index) => (
        <TouchableOpacity key={index} onPress={() => alert(`${entry.username}'s stats: ${entry.score}`)} style={styles.button}>
          <Text style={styles.user}>{entry.username}: {entry.score}</Text>
        </TouchableOpacity>
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
  user: {
    fontSize: 18,
    marginVertical: 5,
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
