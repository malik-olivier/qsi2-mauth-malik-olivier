const express = require('express');
const jwt = require('jwt-simple');
const { addPost,getPostByGroup } = require('../controller/posts');
const logger = require('../logger');

const apiPostProtected = express.Router();

apiPostProtected.post('/', (req, res) => {
  logger.info("[API](apiGroupProtected) id : "+req.user.id);
  var userId = req.user.id;
  var message = req.body.message;
  var groupId = req.body.groupId;
  !message || !groupId
    ? res.status(400).send({
        success: false,
        message: 'message and groupId are required'
      })
    : addPost({ message, userId, groupId })
        .then(post => {
          return res.status(201).send({
            success: true,
            post: post,
            message: 'post created'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to create post : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
    }
);

apiPostProtected.get('/', (req, res) => {
  logger.info("[API](apiGroupProtected GET) id : "+req.user.id);
  var groupId = req.body.groupId;
   !groupId
    ? res.status(400).send({
        success: false,
        message: 'groupId is required'
      })
    : 
  getPostByGroup(req.user.id,groupId)
      .then(posts => {
        return res.status(201).send({
          success: true,
          posts: posts,
          message: 'get posts'
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to get groups : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
  }
);

module.exports = {apiPostProtected };