// Create the router object that will manage all operations on movies
const moviesRouter = require("express").Router();
// Import the movie model that we'll need in controller functions
const Movies = require("../models/movies");

// GET /api/movies/
moviesRouter.get("/", (req, res) => {
  const { max_duration, color } = req.query;
  Movies.findMany({ filters: { max_duration, color } })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error retrieving movies from database");
    });
});

// TODO : GET /api/movies/:id
// moviesRouter.get('/:id', (req, res) => { ... })
moviesRouter.get("/:id", (req, res) => {
  Movies.findOne(req.params.id)
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send("Movie not found");
    })
    .catch((err) => {
      res.send("Error retrieving data from database");
    });
});

moviesRouter.post("/", (req, res) => {
  const error = Movies.validateMoviesData(req.body);
  console.log(error);
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    Movies.createOne(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send("Error saving the movie");
      });
  }
});

moviesRouter.put("/:id", (req, res) => {
  const error = Movies.validateMoviesData(req.body);
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    Movies.findOne(req.params.id)
      .then((movie) => {
        if (movie) {
          existingMovie = movie;
          console.log("Updating");
          Movies.updateOne(req.body, req.params.id).then((result) => {
            res.status(200).json({ ...movie[0][0], ...req.body });
          });
          return;
        }
        return res.status(404).json({ msg: "Record not found" });
      })
      .catch((err) => {
        res.status(500).send("Error updating the movie");
      });
  }
});

moviesRouter.delete("/:id", (req, res) => {
  Movies.deleteOne(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send("Error deleting movie from database");
    });
});

// Don't forget to export the router in order to link it to the app in routes/index.js
module.exports = moviesRouter;
