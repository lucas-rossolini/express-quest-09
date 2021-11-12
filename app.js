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

app.get('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  
  connexion.promise().query(
    'SELECT * FROM movies WHERE id = ?',
    [movieId])
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send('Movie not found');
    }).catch((err)=> {
      res.send('Error retrieving data from database');
    })
});

app.get('/api/movies', (req, res) => {
  let query = 'SELECT * FROM movies';
  let value = [];

  if(req.query.color && req.query.max_duration) {
    query += ' WHERE color = ? AND duration = ?';
    value.push(req.query.color, req.query.max_duration)
  } else if (req.query.color){ 
    query += ' WHERE color = ?';
    value.push(req.query.color)
  } else if (req.query.max_duration) {
    query += ' WHERE duration < ?';
    value.push(req.query.max_duration)
  }

  connexion.promise().query(query, value)
    .then((result) => {
      res.status(200).json(result[0]);
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

app.put("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const moviesPropsToUpdate = req.body;

  connexion.promise().query(
    'UPDATE movies SET ? WHERE id = ?',
    [moviesPropsToUpdate, movieId])
    .then((result) => {
      res.send("Movie updated successfully")
    })
    .catch((err) => {
      res.send("Error updating the movie")
    })
})

app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;

  connexion.promise().query(
    'DELETE FROM movies WHERE id = ?',
    [movieId])
    .then((result) => {
      res.send('Movie deleted successfully')
    })
    .catch((err) => {
      res.send("Error deleting the movie")
    })
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  connexion.promise().query(
    'SELECT * FROM users WHERE id = ?',
    [userId])
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send('User not found');
    }).catch((err)=> {
      res.send('Error retrieving data from database');
    })
});

app.get('/api/users', (req, res) => {
  let query = 'SELECT * FROM users';
  if(req.query.language) query += ' WHERE language = ?'

  connexion.promise().query(query, [req.query.language])
    .then((result) => {
      res.json(result[0]);
    }).catch((err)=> {
      res.send('Error retrieving data from database');
    })
});

app.post('/api/users', (req, res) => {
  const { firstname, lastname, email } = req.body;
  connexion.promise().query(
    'INSERT INTO users(firstname, lastname, email) VALUES (?, ?, ?)',
    [firstname, lastname, email])
    .then((result) =>  {
      res.send('User successfully saved');
    })
    .catch((err) => {
      res.send('Error saving the user');
    })
})

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userPropsToUpdate = req.body;

  connexion.promise().query(
    'UPDATE users SET ? WHERE id = ?',
    [userPropsToUpdate, userId])
    .then((result) => {
      res.send("User updated successfully")
    })
    .catch((err) => {
      res.send("Error updating the user")
    })
})

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  connexion.promise().query(
    'DELETE FROM users WHERE id = ?',
    [userId])
    .then((result) => {
      res.send('User deleted successfully')
    })
    .catch((err) => {
      res.send("Error deleting the user")
    })
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});