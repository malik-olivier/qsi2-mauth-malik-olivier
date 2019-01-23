const express = require('express');
const jwt = require('jwt-simple');
const { createGroup,getGroupsByOwner,addMemberByOwner,getGroups,removeMemberByOwner} = require('../controller/groups');
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

apiGroupProtected.get('/mygroups', (req, res) => {
  logger.info("[API](apiGroupProtected GET) id : "+req.user.id);
  getGroupsByOwner(req.user.id)
      .then(groups => {
        return res.status(201).send({
          success: true,
          groups: groups,
          message: 'get my groups'
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

apiGroupProtected.get('/', (req, res) => {
  logger.info("[API](apiGroupProtected GET All group) id : "+req.user.id);
  getGroups()
      .then(groups => {
        return res.status(201).send({
          success: true,
          groups: groups,
          message: 'get all group'
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

apiGroupProtected.put('/owner/member', (req, res) => {
  logger.info("[API](apiGroupProtected PUT /owner/member group) userid : "+req.body.idUser);
  logger.info("[API](apiGroupProtected PUT /owner/member group) groupid : "+req.body.idGroup);
  let args = {}
  args.userId = req.body.idUser;
  args.groupId = req.body.idGroup;
  args.ownerId = req.user.id;
  !req.user.id || !req.body.idGroup
    ? res.status(400).send({
        success: false,
        message: 'idUser and idGroup are required'
      })
    
    : addMemberByOwner(args)
      .then(groups => {
        return res.status(201).send({
          success: true,
          groups: groups,
          message: 'new member'
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to add a new member : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
  
  }
);

apiGroupProtected.delete('/owner/member', (req, res) => {
  logger.info("[API](apiGroupProtected DEL /owner/member group) userid : "+req.body.idUser);
  logger.info("[API](apiGroupProtected DEL /owner/member group) groupid : "+req.body.idGroup);
  let args = {}
  args.userId = req.body.idUser;
  args.groupId = req.body.idGroup;
  args.ownerId = req.user.id;
  !req.user.id || !req.body.idGroup
    ? res.status(400).send({
        success: false,
        message: 'idUser and idGroup are required'
      })
    
    : removeMemberByOwner(args)
      .then(groups => {
        return res.status(201).send({
          success: true,
          groups: groups,
          message: 'remove member'
        });
      })
      .catch(err => {
        logger.error(`💥 Failed to remove a member : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
  
  }
);



module.exports = {apiGroupProtected };

//JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjhjZDEwMTgyLWUyMmItNDFmNi1iMWIyLTQ2YzdmZjliNGVkNiJ9.60Tt8tX6gFVNJdaTyW2xXgxi9Dl7_hEPYnKuzbrkbd0