const request = require('request');

// recommendedVenues params: ll, near, section
exports.getRecommendedVenues = (req, res, next) => {
    console.log("Recommended Venues:");
    console.log(req.query);
    console.log("-------");
    getVenues(req).then((response) => {
        if(response.meta.code == 200){
            res.status(200).send(response);
        }else{
            res.status(404).send(response);
        }
    }).catch(err => res.status(400).send(err)); 
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
                    near: req.query.near,
                    ll: req.query.ll,
                    radius: req.query.radius,
                    section: req.query.section,
                    v: '20180323',
                    limit: 10
                }
            }, function (err, res, body) {
                if (err) {
                    console.error(err);
                    reject(new Error("API Error"));
                } else { // good response
                    let response = JSON.parse(body);
                    resolve(response);
                }
            });
        });
    }
