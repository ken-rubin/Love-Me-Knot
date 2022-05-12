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

    app.use(Express.json());

    app.post("/set", (req, res) => {

        try {

            const pathname = `./attendies/${req.body.she}${req.body.he}.dat`;
            if (fs.existsSync(pathname)) {

                fs.unlinkSync(pathname)
            }

            fs.writeFileSync(pathname,
                req.body.attendies,
                {encoding:'utf8'});

            res.json({

                success: true
            });
        } catch (x) {

            res.json({

                success: false, 
                payload: x.message
            });
        }
    });

    app.post("/get", (req, res) => {

        try {

            let data = `${req.body.she}${'\n'}${req.body.he}`;
            const pathname = `./attendies/${req.body.she}${req.body.he}.dat`;
            if (fs.existsSync(pathname)) {

                data = fs.readFileSync(pathname,
                    {encoding:'utf8', flag:'r'});
            }
            console.log(`data: ${data}`);

            res.json({

                success: true,
                payload: data
            });
        } catch (x) {

            res.json({

                success: false, 
                payload: x.message
            });
        }
    });
});

