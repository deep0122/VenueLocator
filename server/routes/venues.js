const express = require('express');
const { getVenues } = require('../controllers/venues');
const { getVenue } = require('../controllers/venue');

const router = express.Router();

router.route('/venues').get(getVenues);
router.route('/:venue').get(getVenue);

module.exports = router;