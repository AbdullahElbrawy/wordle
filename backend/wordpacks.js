const wordPacks = {
    animals: ['TIGER', 'LION', 'ELEPHANT'],
    technology: ['COMPUTER', 'SMARTPHONE', 'ROBOT'],
    // Add more packs
  };
  
  app.get('/wordPack', (req, res) => {
    const { pack } = req.query;
    res.json(wordPacks[pack] || []);
  });
  