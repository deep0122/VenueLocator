const express = require('express');
const cors = require('cors');

const app = express();

// Load env variables
require('dotenv').config({path: __dirname + '/../.env'});

// serve static files
app.use(express.static(path.join(__dirname, 'client/build')))

// native body parser
app.use(express.json());

// use cors
app.use(cors({origin: ['http://localhost:3000']}));

// routes
app.use('/', require('./routes/venues'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

const port = process.env.EXPRESS_PORT || 5000;
app.listen(port, () => {
  console.log(`VenueLocator listening on port ${port}!`);
});
