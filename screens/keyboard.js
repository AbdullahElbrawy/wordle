import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const keyboardLayouts = {
  en: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
  fr: 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split(''),
  es: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
  it: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
  de: 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM'.split(''),
  pt: 'QWERTYUIOPASDFGHJKLÇZXCVBNM'.split(''),
  ru: 'ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ'.split(''),
  zh: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''), // Simplified Chinese uses Pinyin
  ja: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''), // Japanese uses Romaji
  ko: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''), // Korean uses Romanized characters
  ar: 'ضصثقفغعهخحجچشسیبلاتنمکظطزرذدپو'.split(''), // Arabic layout
  hi: 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह'.split(''), // Hindi layout
  tr: 'FJDKSLQWERTÜYIOĞPÇĞÜİŞZXCVBNMÖĞ'.split(''),
  nl: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
  sv: 'QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM'.split(''),
  no: 'QWERTYUIOPÅASDFGHJKLØÆZXCVBNM'.split(''),
  fi: 'QWERTYUIOPASDFGHJKLÖÄZXCVBNM'.split(''),
  pl: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
  el: 'ΘΕΡΤΥΙΟΠΑΣΔΦΓΗΞΚΛΖΧΨΩΒΝΜ'.split(''),
   en: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
    fr: 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split(''),
    es: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
    it: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
    de: 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM'.split(''),
    zh: '一二三四五六七八九十'.split(''),
    ja: 'あいうえおかきくけこさしすせそたちつてとなにぬねの'.split(''),
    ko: 'ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔㅁㄴㅇㄹㅎㅗㅓㅏㅣ'.split(''),
    // Add more languages as needed
};

export default function CustomKeyboard({ onKeyPress, language }) {
  const layout = keyboardLayouts[language] || keyboardLayouts.en;

  return (
    <View style={styles.keyboard}>
      {layout.map((key) => (
        <TouchableOpacity key={key} style={styles.key} onPress={() => onKeyPress(key)}>
          <Text style={styles.keyText}>{key}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: 35,
    height: 35,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 5,
  },
  keyText: {
    color: '#FFF',
    fontSize: 18,
  },
});
