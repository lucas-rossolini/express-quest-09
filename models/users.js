const connection = require("../db-config");
const Joi = require("joi");
const argon2 = require("argon2");

const db = connection.promise();

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (plainPassword) => {
  return argon2.hash(plainPassword, hashingOptions);
};

const verifyPassword = (plainPassword, hashedPassword) => {
  return argon2.verify(hashedPassword, plainPassword, hashingOptions);
};

const validateUserData = (data) => {
  return Joi.object({
    email: Joi.string().email().max(255),
    firstname: Joi.string().max(255),
    lastname: Joi.string().max(255),
    city: Joi.string().allow(null, "").max(255),
    language: Joi.string().allow(null, "").max(255),
    password: Joi.string().max(255),
  }).validate(data, { abortEarly: false });
};

const findMany = ({ filters: { language } }) => {
  let query = "SELECT * FROM users";
  let sqlValues = [];

  if (language) {
    query += " WHERE language = ?";
    sqlValues.push(language);
  }

  return db.query(query, sqlValues).then(([results]) => {
    console.log(results);
    return results;
  });
};

const findOne = (id) => {
  return db
    .query("SELECT * FROM users WHERE id = ?", [id])
    .then((results) => results);
};

const createOne = ({
  email,
  firstname,
  lastname,
  city,
  language,
  hashedPassword,
}) => {
  console.log();
  return db
    .query(
      "INSERT INTO users (email, firstname, lastname, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [email, firstname, lastname, city, language, hashedPassword]
    )
    .then(([result]) => {
      console.log(result);
      const id = result.insertId;
      return { id, email, firstname, lastname, city, language };
    });
};

const updateOne = ({
  firstname,
  lastname,
  email,
  city,
  language,
  hashedPassword,
}) => {
  return db
    .query("UPDATE users SET ? WHERE id = ?", [data, id])
    .then((result) => result);
};

const deleteOne = (id) => {
  return db
    .query("DELETE FROM users WHERE id = ?", [id])
    .then((result) => "User deleted successfully");
};

const findByEmail = (email) => {
  return connection.promise().query(
    'SELECT hashedPassword, id FROM users WHERE email = ?',
    [email])
    .then((results) => results[0][0])
}

module.exports = {
  validateUserData,
  findMany,
  findOne,
  createOne,
  updateOne,
  deleteOne,
  hashPassword,
  verifyPassword,
  findByEmail,
};
