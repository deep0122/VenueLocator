const express = require('express');
const { getSearchVenues } = require('../controllers/searchVenues');
const { getVenueDetails } = require('../controllers/venueDetails');
const { getRecommendedVenues } = require('../controllers/recommendedVenues')

const router = express.Router();

router.route('/searchvenues').get(getSearchVenues);
router.route('/venuedetails/:venue').get(getVenueDetails);
router.route('/recommendedvenues').get(getRecommendedVenues);

module.exports = router;