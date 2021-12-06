const connection = require("../db-config");
const Joi = require("joi");

const db = connection.promise();

const validateMoviesData = (data) => {
  return Joi.object({
    title: Joi.string().max(255),
    director: Joi.string().max(255),
    year: Joi.number().integer().min(1888).required(),
    color: Joi.number().required().min(0),
    duration: Joi.number().integer().min(1).required(),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = ({ filters: { color, max_duration } }) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];
  if (color) {
    sql += " WHERE color = ?";
    sqlValues.push(color);
  }
  if (max_duration) {
    if (color) sql += " AND duration <= ? ;";
    else sql += " WHERE duration <= ?";
    sqlValues.push(max_duration);
  }
  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM movies WHERE id = ?", [id])
    .then((results) => results);
};

const createOne = ({ title, director, year, color, duration }) => {
  return db
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { id, title, director, year, color, duration };
    });
};

const updateOne = ({ title, director, year, color, duration }) => {
  return db
    .query("UPDATE movies SET ? WHERE id = ?", [data, id])
    .then((result) => result);
};

const deleteOne = (id) => {
  return db
    .query("DELETE FROM movies WHERE id = ?", [id])
    .then((result) => "Movie deleted successfully");
};

module.exports = {
  validateMoviesData,
  findMany,
  findOne,
  createOne,
  updateOne,
  deleteOne,
};
