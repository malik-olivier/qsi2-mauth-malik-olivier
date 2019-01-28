const omit = require('lodash.omit');
const { Posts } = require('../model');
const logger = require('../logger');
const { isInGroup} = require('../controller/groups');


const addPost = ({ message, userId, groupId }) => {
  logger.info("[CONTROLLER](addPost) object : "+  message);
  return isInGroup(userId,groupId).then(
    isInGroup => {
      if(!isInGroup) return Promise.reject(new Error("The user isn't in the group"));
      else {
        return Posts.create({
          message:message,
          user_id: userId,
          group_id: groupId
        }).then(group => {
          return omit(
            group.get({
              plain: true
            })
          )  
        }
        );
      }
    }
  )
}


const getPostByGroup = (userId,groupId) => {
  logger.info("[CONTROLLER](getPostByGroup) ownerId : "+  groupId);
  return isInGroup(userId,groupId).then(
    isInGroup => {
      if(!isInGroup) return Promise.reject(new Error("The user isn't in the group"));
      else {
        return Posts.findAll({ 
          where : {
            group_id : groupId
          }
        }).then(posts => {
          return posts  
        }
        );
      }
    }
  )
}

module.exports = {
  addPost,
  getPostByGroup
};