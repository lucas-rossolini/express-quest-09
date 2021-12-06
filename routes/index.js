const moviesRouter = require('./movies');
const usersRouter = require('./users')

const setupRoutes = (app) => {
  app.use('/api/movies', moviesRouter);
  // TODO later : app.use('/api/users', usersRouter);
  app.use('/api/users', usersRouter);
};

module.exports = {
  setupRoutes,
};