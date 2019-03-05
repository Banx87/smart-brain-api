const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString : process.env.DATABASE_URL,
        ssl: true,
        headers: {
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
        //searchPath: ['knex', 'public']
    },
    pool: {min: 0, max: 7},
    acquireConnectionTimeout: 5000
});

/*var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};*/

/*db.select('*').from ('users')
    .then(data => {
        console.log(data);
        });*/

const app = express();

//app.use(cors());
//app.use(allowCrossDomain);
app.use(bodyParser.json());

//app.options('*', cors());

app.get('/', (req, res) => { //res.send(db.users);
    res.send('this is working');
});

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});
app.put('/image', (req, res) => { image.handleImage(req, res, db)});
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)});

//const DATABASE_URL = process.env.DATABASE_URL;
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
    //console.log(process.env);
});

/*
PLANNING THE ROUTES / ENDPOINTS

/ --> res = this is working
/signin --------------> POST = success/fail
/register ------------> POST = user
/profile/:userId -----> GET = user
/image ---------------> PUT --> user

 */