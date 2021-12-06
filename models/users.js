const connection = require("../db-config");
const Joi = require("joi");

const db = connection.promise();

const validateUserData = (data) => {
  return Joi.object({
    email: Joi.string().email().max(255),
    firstname: Joi.string().max(255),
    lastname: Joi.string().max(255),
    city: Joi.string().allow(null, "").max(255),
    language: Joi.string().allow(null, "").max(255),
  }).validate(data, { abortEarly: false });
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then((results) => results);
};

const createOne = ({ firstname, lastname, email, city, language }) => {
  return db
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { id, firstname, lastname, email, city, language };
    });
};

const updateOne = ({ firstname, lastname, email, city, language }) => {
  return db
    .query("UPDATE users SET ? WHERE id = ?", [data, id])
    .then((result) => result);
};

const deleteOne = (id) => {
  return db
    .query("DELETE FROM users WHERE id = ?", [id])
    .then((result) => "User deleted successfully");
};

module.exports = {
  validateUserData,
  findOne,
  createOne,
  updateOne,
  deleteOne,
};
