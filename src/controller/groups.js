const omit = require('lodash.omit');
const { Groups } = require('../model');
const logger = require('../logger');

const createGroup = ({ title, description, metadata, ownerId }) => {
  logger.info("[CONTROLLER](createGroup) object : "+  metadata);
  return Groups.create({
    title:title,
    description: description,
    metadata: metadata || {},
    owner_id : ownerId
  }).then(group =>
    omit(
      group.get({
        plain: true
      }),
      Groups.excludeAttributes
    )
  );
}

module.exports = {
    createGroup
};