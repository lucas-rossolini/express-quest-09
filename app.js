const express = require('express');
const app = express();
const { setupRoutes } = require('./routes');

const port = process.env.PORT || 3000;

app.use(express.json());
setupRoutes(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});