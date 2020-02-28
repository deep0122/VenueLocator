const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Load env variables
const {parsed, error} = require('dotenv').config({path: __dirname + '/.env'});
console.log(parsed);

// serve static files
app.use(express.static(path.join(__dirname, 'client/build')))

// native body parser
app.use(express.json());

// use cors
app.use(cors({origin: ['http://localhost:3000']}));

// routes
app.use('/', require('./routes/venues'));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`VenueLocator listening on port ${port}!`);
});
