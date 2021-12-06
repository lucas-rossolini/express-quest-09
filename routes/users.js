// Create the router object that will manage all operations on users
const usersRouter = require("express").Router();
// Import the users model that we'll need in controller functions
const Users = require("../models/users");

usersRouter.get("/:id", (req, res) => {
  Users.findOne(req.params.id)
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send("User not found");
    })
    .catch((err) => {
      res.send("Error retrieving data from database");
    });
});

usersRouter.post("/", (req, res) => {
  const error = Users.validateUserData(req.body);
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    Users.createOne(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send("Error saving the user");
      });
  }
});

usersRouter.put("/:id", (req, res) => {
  const error = Users.validateUserData(req.body);
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    Users.findOne(req.params.id)
      .then((user) => {
        if (user) {
          existingUser = user;
          console.log("Updating");
          Users.updateOne(req.body, req.params.id).then((result) => {
            res.status(200).json({ ...user[0][0], ...req.body });
          });
          return;
        }
        return res.status(404).json({ msg: "Record not found" });
      })
      .catch((err) => {
        res.status(500).send("Error updating the user");
      });
  }
});

usersRouter.delete("/:id", (req, res) => {
  Users.deleteOne(req.params.id)
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      res.send('Error deleting users from database');
    })
});

module.exports = usersRouter;

