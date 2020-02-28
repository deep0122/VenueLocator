const request = require('request');

exports.getVenueDetails = (req, res, next) => {
    console.log("Venue Query:");
    console.log(`venue: ${req.params.venue}`);
    console.log("------")
    getVenue(req).then((response) => {
        if(response.meta.code == 200){
            res.status(200).send(response.response.venue);
        }else{
            res.status(404).send(response);
        }
    }).catch(err => res.status(400).send(err)); 
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
                reject(new Error("Server Error"));
            } else { // good response
                let response = JSON.parse(body);
                resolve(response);
            }
        });
    });
}

