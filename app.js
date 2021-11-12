const connexion = require('./db-config');
const express = require('express');
const { createConnection } = require('net');
const app = express();

const port = process.env.PORT || 3000;

connexion.connect((err) => {
  if(err) {
    console.error('error connecting' + err.stack)
  } else {
    console.log('connected as id ' + connexion.threadId)
  }
})

app.get('/api/movies', (req, res) => {
  connection.query('SELECT * FROM movies', (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving data from database');
    } else {
      res.json(result);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});