const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const cors = require('cors');
const { db, auth } = require('./firebaseConfig');

app.use(cors());
app.use(express.json());

// Firebase references
const wordsRef = db.collection('words');
const dailyWordsRef = db.collection('dailyWords');
const userPuzzlesRef = db.collection('userPuzzles');
const userHintsRef = db.collection('userHints');
const userAchievementsRef = db.collection('userAchievements');
const geolocationWordsRef = db.collection('geolocationWords');
const wordPacksRef = db.collection('wordPacks');
const leaderboardRef = db.collection('leaderboard');
const storiesRef = db.collection('stories');

const difficultyLevels = {
  easy: ['CAT', 'DOG', 'SUN'],
  medium: ['ELEPHANT', 'GIRAFFE', 'ROBOT'],
  hard: ['MICROPROCESSOR', 'QUANTUM', 'SCHRODINGER'],
};

// Function to get a random word based on difficulty
const getWordByDifficulty = async (lang, difficulty) => {
  const wordsSnapshot = await wordsRef.where('lang', '==', lang).get();
  const words = wordsSnapshot.docs.map(doc => doc.data().word);
  const filteredWords = words.filter(word => difficultyLevels[difficulty].includes(word));
  const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  return randomWord;
};

// Route to get a daily word
app.get('/daily', async (req, res) => {
  const lang = req.query.lang || 'en';
  const wordSnapshot = await dailyWordsRef.where('lang', '==', lang).get();
  const words = wordSnapshot.docs.map(doc => doc.data().word);
  const randomWord = words[Math.floor(Math.random() * words.length)];
  res.json({ word: randomWord });
});

// Route to get a random word based on difficulty level
app.get('/word', async (req, res) => {
  const lang = req.query.lang || 'en';
  const difficulty = req.query.difficulty || 'medium';
  const word = await getWordByDifficulty(lang, difficulty);
  res.json({ word });
});

// Route to get word based on geolocation
app.get('/geolocationWord', async (req, res) => {
  const location = req.query.location; // Assume location is provided as a query parameter
  const doc = await geolocationWordsRef.doc(location).get();
  const word = doc.exists ? doc.data().word : 'TRAVEL';
  res.json({ word });
});

// Route to handle leaderboard updates
app.post('/leaderboard', async (req, res) => {
  const { username, score } = req.body;
  const docRef = leaderboardRef.doc(username);
  const doc = await docRef.get();
  if (doc.exists) {
    const currentScore = doc.data().score;
    await docRef.update({ score: currentScore + score });
  } else {
    await docRef.set({ username, score });
  }
  res.json({ success: true });
});

// Route to get leaderboard
app.get('/leaderboard', async (req, res) => {
  const snapshot = await leaderboardRef.get();
  const leaderboard = snapshot.docs.map(doc => doc.data());
  res.json(leaderboard);
});

// Route to get past challenges
app.get('/pastChallenges', async (req, res) => {
  const snapshot = await db.collection('pastChallenges').get();
  const challenges = snapshot.docs.map(doc => doc.data());
  res.json(challenges);
});

// Route to create a user-generated puzzle
app.post('/createPuzzle', async (req, res) => {
  const { username, puzzle } = req.body;
  await userPuzzlesRef.add({ username, puzzle });
  res.json({ success: true });
});

// Route to get user-generated puzzles
app.get('/userPuzzles', async (req, res) => {
  const snapshot = await userPuzzlesRef.get();
  const puzzles = snapshot.docs.map(doc => doc.data());
  res.json(puzzles);
});

// Route to handle hint usage
app.post('/useHint', async (req, res) => {
  const { username, hintType } = req.body;
  const docRef = userHintsRef.doc(username);
  const doc = await docRef.get();
  if (doc.exists) {
    const hints = doc.data();
    if (hints[hintType] > 0) {
      hints[hintType]--;
      await docRef.update(hints);
      res.json({ success: true, hintsLeft: hints[hintType] });
    } else {
      res.json({ success: false, message: 'No hints left' });
    }
  } else {
    res.json({ success: false, message: 'User not found' });
  }
});

// Route to handle achievements
app.post('/achievement', async (req, res) => {
  const { username, achievement } = req.body;
  const docRef = userAchievementsRef.doc(username);
  const doc = await docRef.get();
  if (doc.exists) {
    const achievements = doc.data().achievements || [];
    achievements.push(achievement);
    await docRef.update({ achievements });
  } else {
    await docRef.set({ username, achievements: [achievement] });
  }
  res.json({ success: true });
});

// Route to get user achievements
app.get('/achievements', async (req, res) => {
  const { username } = req.query;
  const doc = await userAchievementsRef.doc(username).get();
  res.json(doc.exists ? doc.data().achievements : []);
});

// Route to get story parts
app.get('/story', async (req, res) => {
  const { id, part } = req.query;
  const doc = await storiesRef.doc(id).get();
  const story = doc.exists ? doc.data() : null;
  const storyPart = story ? story.parts.find(p => p.part === parseInt(part)) : null;
  res.json(storyPart);
});

// Route to get word packs
app.get('/wordPack', async (req, res) => {
  const { pack } = req.query;
  const doc = await wordPacksRef.doc(pack).get();
  res.json(doc.exists ? doc.data().words : []);
});

// Route to handle user profile creation/updating
const userProfilesRef = db.collection('userProfiles');

app.post('/profile', async (req, res) => {
  const { username, profile } = req.body;
  const docRef = userProfilesRef.doc(username);
  await docRef.set(profile);
  res.json({ success: true });
});

// Route to get user profile
app.get('/profile', async (req, res) => {
  const { username } = req.query;
  const doc = await userProfilesRef.doc(username).get();
  res.json(doc.exists ? doc.data() : {});
});

// Route to get word details (definitions, conjugations, synonyms)
app.get('/wordDetails', async (req, res) => {
  const lang = req.query.lang || 'en';
  const word = req.query.word;
  // Here you would integrate with a dictionary API to get the word details
  // For simplicity, returning a dummy response
  res.json({
    word: word,
    definition: `Definition of ${word} in ${lang}`,
    conjugations: `Conjugations of ${word} in ${lang}`,
    synonyms: `Synonyms of ${word} in ${lang}`
  });
});

// WebSocket for real-time multiplayer
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('wordGuess', (msg) => {
    io.emit('wordGuess', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
