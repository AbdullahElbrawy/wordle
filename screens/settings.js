import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSettings } from '../settingsContext';

export default function SettingsScreen() {
  const { language, setLanguage, difficulty, setDifficulty, wordPack, setWordPack } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Select Language</Text>
      <Picker
        selectedValue={language}
        style={styles.picker}
        onValueChange={(itemValue) => setLanguage(itemValue)}
      >
        <Picker.Item label="English" value="en" />
        <Picker.Item label="Spanish" value="es" />
        <Picker.Item label="French" value="fr" />
        <Picker.Item label="Italian" value="it" />
        <Picker.Item label="German" value="de" />
        <Picker.Item label="Portuguese" value="pt" />
        <Picker.Item label="Russian" value="ru" />
        <Picker.Item label="Chinese" value="zh" />
        <Picker.Item label="Japanese" value="ja" />
        <Picker.Item label="Korean" value="ko" />
        <Picker.Item label="Arabic" value="ar" />
        <Picker.Item label="Hindi" value="hi" />
        <Picker.Item label="Turkish" value="tr" />
        <Picker.Item label="Dutch" value="nl" />
        <Picker.Item label="Swedish" value="sv" />
        <Picker.Item label="Norwegian" value="no" />
        <Picker.Item label="Finnish" value="fi" />
        <Picker.Item label="Polish" value="pl" />
        <Picker.Item label="Greek" value="el" />
      </Picker>

      <Text style={styles.label}>Select Difficulty</Text>
      <Picker
        selectedValue={difficulty}
        style={styles.picker}
        onValueChange={(itemValue) => setDifficulty(itemValue)}
      >
        <Picker.Item label="Easy" value="easy" />
        <Picker.Item label="Medium" value="medium" />
        <Picker.Item label="Hard" value="hard" />
      </Picker>

      <Text style={styles.label}>Select Word Pack</Text>
      <Picker
        selectedValue={wordPack}
        style={styles.picker}
        onValueChange={(itemValue) => setWordPack(itemValue)}
      >
        <Picker.Item label="Animals" value="animals" />
        <Picker.Item label="Technology" value="technology" />
        <Picker.Item label="Food" value="food" />
        <Picker.Item label="Countries" value="countries" />
        <Picker.Item label="Colors" value="colors" />
        <Picker.Item label="Sports" value="sports" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ea',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    height: 50,
    width: 250,
    marginBottom: 20,
  },
});
