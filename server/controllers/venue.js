const request = require('request');

exports.getVenue = (req, res, next) => {
    console.log("Venue Query:");
    console.log(`venue: ${req.params.venue}`);
    console.log("------")
    getVenue(req).then((response) => {
      res.send(response);
    }); 
  }

// request for venue details with id

let getVenue = (req) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.foursquare.com/v2/venues/' + req.params.venue,
            method: 'GET',
            qs: {
                client_id: process.env.FS_CLIENT_ID,
                client_secret: process.env.FS_CLIENT_SECRET,
                v: '20180323'
            }
        }, function (err, res, body) {
            if (err) {
                console.error(err);
            } else { // good response
                let response = JSON.parse(body);
                resolve(response);
            }
        });
    });
}

