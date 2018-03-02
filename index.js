const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ notes: 'Test' });
});

app.listen(3000);
