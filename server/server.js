const express = require('express');
const cors = require('cors');

const app = express();

// Load env variables
require('dotenv').config({path: __dirname + '/../.env'});

// native body parser
app.use(express.json());

// use cors
app.use(cors({origin: ['http://localhost:3000']}));

// routes
app.use('/', require('./routes/venues'));


const port = process.env.EXPRESS_PORT || 5000;
app.listen(port, () => {
  console.log(`VenueLocator listening on port ${port}!`);
});
