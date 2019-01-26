const hpp = require('hpp');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const enforce = require('express-sslify');


const { apiUsers, apiUsersProtected } = require('./users');
const { apiGroupProtected } = require('./groups');
const { isAuthenticated, initAuth } = require('../controller/auth');
// create an express Application for our api
const api = express();
initAuth();
api.use(hpp());
api.use(helmet())
app.use(enforce.HTTPS({ trustProtoHeader: true }))

// apply a middelware to parse application/json body
api.use(express.json({ limit: '1mb' }));
// create an express router that will be mount at the root of the api
const apiRoutes = express.Router();


apiRoutes
  // test api
  .get('/', (req, res) =>
    res.status(200).send({ message: 'hello from my api' })
  )
  // connect api users router
  .use('/users', apiUsers)
  // api bellow this middelware require Authorization
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/groups', apiGroupProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

// root of our API will be http://localhost:5000/api/v1
api.use('/api/v1', apiRoutes);
module.exports = api;