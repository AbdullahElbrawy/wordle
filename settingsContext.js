import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [difficulty, setDifficulty] = useState('easy');
  const [wordPack, setWordPack] = useState('animals');

  return (
    <SettingsContext.Provider value={{ language, setLanguage, difficulty, setDifficulty, wordPack, setWordPack }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
