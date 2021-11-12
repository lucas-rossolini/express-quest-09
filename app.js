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
  connexion.promise().query('SELECT * FROM movies')
    .then((result) => {
      res.json(result);
    }).catch((err)=> {
      res.send('Error retrieving data from database');
    })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});