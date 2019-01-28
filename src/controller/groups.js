const omit = require('lodash.omit');
const { Groups } = require('../model');
const logger = require('../logger');

const createGroup = ({ title, description, metadata, ownerId }) => {
  // logger.info("[CONTROLLER](createGroup) object : "+  metadata);
  return Groups.create({
    title:title,
    description: description,
    metadata: metadata || {},
    owner_id : ownerId
  }).then(group => {
    logger.info("[CONTROLLER](createGroup) owner id : "+  ownerId);
    group.addUsers(ownerId)
    return omit(
      group.get({
        plain: true
      })
    )
  
  }
  );
}


const getGroupsByOwner = (ownerId) => {
  logger.info("[CONTROLLER](getGroupByOwner) ownerId : "+  ownerId);
  return Groups.findAll({ 
    where : {
      owner_id : ownerId
    }
  }).then(groups =>
      groups
  );
}

const getGroups = () => {
  logger.info("[CONTROLLER](getGroups)");
  return Groups.findAll().then(groups =>
      groups
  )
}

const addMemberByOwner = ({ userId , groupId ,ownerId}) => {
  logger.info("[CONTROLLER](addMemberByOwner) userId : "+  userId);
  logger.info("[CONTROLLER](addMemberByOwner) groupId : "+  groupId);
  return Groups.findOne({where :{id : groupId}})
  .then(group => {
   return (group != null && group.owner_id == ownerId )
      ? group.addUsers(userId).then(() => {return Promise.resolve("The user [id="+userId+"] has been added in th group [="+group.title+"]")})
      : Promise.reject(new Error("An error occurred while adding a new member : USER HASN'T PERMISSION OR USER (IN PARAMETER) DON't EXIST OR GRoup DON'T exists"));
    }
  );
}

const removeMemberByOwner = ({ userId , groupId ,ownerId}) => {
  logger.info("[CONTROLLER](removeMemberByOwner) userId : "+  userId);
  logger.info("[CONTROLLER](removeMemberByOwner) groupId : "+  groupId);
  return Groups.findOne({where :{id : groupId}})
  .then(group => {
   return (group != null && group.owner_id == ownerId && ownerId != userId)
      ?     /*logger.info("[CONTROLLER](removeMemberByOwner) remove User of groupe : "+  group.title) &&*/
        group.removeUsers(userId).then(() => {return Promise.resolve("The user [id="+userId+"] has been removed of the group [="+group.title+"]")})
      : Promise.reject(new Error("An error occurred while deleting a member : USER HASN'T PERMISSION OR USER (IN PARAMETER) DON't EXIST OR GRoup DON'T exists"));
    }
  );
}

const isInGroup = (userId , groupId) => {
  logger.info("[CONTROLLER](isInGroup) userId : "+  userId);
  logger.info("[CONTROLLER](isInGroup) groupId : "+  groupId);
  return Groups.findOne({where :{id : groupId}})
  .then(group => {
      if(group == null) {
        return Promise.reject(new Error("An error occurred while getting a group"));
      }else {
        return group.getUsers().then(users=>{
            var x = users.filter(user => user.id = userId).length;
            return (x > 0 ? Promise.resolve(true) : Promise.reject(new Error("The user isn't in group"))) 
        });
      }
    }
  );
}

module.exports = {
    createGroup,
    getGroupsByOwner,
    getGroups,
    addMemberByOwner,
    isInGroup,
    removeMemberByOwner
};