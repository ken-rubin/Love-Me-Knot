const fs = require('fs');
const https = require('https');
const Express = require('express');
const app = new Express();
app.use(Express.static(__dirname + '/public'));
https.createServer({

    key: fs.readFileSync('/etc/letsencrypt/live/love-me-knot.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/love-me-knot.com/fullchain.pem')
}, app).listen(443, () => {

    console.log(`Listening on: ${443}!`);
});

