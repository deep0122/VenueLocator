### VenueLocator - Search Venues near you

Prerequisites:
  node.js and npm
  APIs - see setup

Packages:

  - React:
    - react-google-maps: easy implementation of Google Maps Javascript Api to show venues
    - recompose: cleaner higher order components

  - Express: create api for react frontend that fetches Foursquare Places Api data

APIs:
  - Google Maps JavaScript API
  - Foursquare Places API 

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

###### Note: This is a test project to get familiarized with the packages so it missing any validation and proper html/css

### Setup

Required API Credentials
 - [Gooogle Maps JavaScript API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
  If you don't care about development watermark, you can use [this url](https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places) for GoogleMapURL in App.js

 - [FourSquare API](https://developer.foursquare.com/places)

```bash
npm install
npm start
```
Execute in both root directory for express and client folder for react then visit http://localhost:3000  






