const request = require('request');

exports.getVenues = (req, res, next) => {
    console.log("Query:");
    console.log(req.query);
    console.log("-------");
    getVenues(req).then((response) => {
        res.send(response);
    }); 
}

    // request for venues
    let getVenues = (req) => {
        return new Promise((resolve, reject) => {
            request({
                url: 'https://api.foursquare.com/v2/venues/explore',
                method: 'GET',
                qs: {
                    client_id: process.env.FS_CLIENT_ID,
                    client_secret: process.env.FS_CLIENT_SECRET,
                    near: req.query.l,
                    query: req.query.q,
                    v: '20180323',
                    limit: 10
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
