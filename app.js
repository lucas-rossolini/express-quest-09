const connexion = require('./db-config');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

connexion.connect((err) => {
  if(err) {
    console.error('error connecting' + err.stack)
  } else {
    console.log('connected as id ' + connexion.threadId)
  }
})

app.use(express.json());

app.get('/api/movies', (req, res) => {
  connexion.promise().query('SELECT * FROM movies')
    .then((result) => {
      res.json(result);
    }).catch((err)=> {
      res.send('Error retrieving data from database');
    })
});

app.post('/api/movies', (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connexion.promise().query(
    'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
    [title, director, year, color, duration])
    .then((result) =>  {
      res.send('Movie successfully saved');
    })
    .catch((err) => {
      res.send('Error saving the movie');
    })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});