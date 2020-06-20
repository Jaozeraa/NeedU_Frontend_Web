const express = require('express')
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));

const PORT = process.env.PORT || 3000;

app.use('/*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});