const express = require('express');
const jwt = require('jwt-simple');
const { createGroup} = require('../controller/groups');
const logger = require('../logger');

const apiGroupProtected = express.Router();

// http://apidocjs.com/#params
/**
 * @api {post} /groups Group creation
 * @apiVersion 1.0.0
 * @apiName createGroup
 * @apiGroup Users
 *
 * @apiParam {STRING} title Title of the group
 * @apiParam {STRING} description of the group .
 * @apiParam {JSON}  Metadata of the group
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiGroupProtected.post('/', (req, res) => {
  logger.info("[API](apiGroupProtected) id : "+req.user.id);
  req.body.ownerId = req.user.id;
  !req.body.title || !req.body.description
    ? res.status(400).send({
        success: false,
        message: 'title and description are required'
      })
    : createGroup(req.body)
        .then(group => {
          return res.status(201).send({
            success: true,
            group: group,
            message: 'group created'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to create group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
    }
);

module.exports = {apiGroupProtected };
