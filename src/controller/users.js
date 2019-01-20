const omit = require('lodash.omit');
const { Users } = require('../model');
const logger = require('../logger');


const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

  
const updateUser = ({ id,firstName, lastName, email, password }) =>
Users.update({
  email,
  firstName: firstName,
  lastName: lastName,
  hash: password
},{
   where: {id: id} ,
   returning : true,
   plain: true}
).then(user => {
    return user && !user.deletedAt
    ? omit(user,Users.all) : Promise.reject(new Error('UNKOWN OR DELETED USER'))
});

const deleteUser = ({ id }) => {
  logger.info("[CONTROLLER](delete user) deleting user with id : "+id)
  return Users.destroy({
    where: {id : id}}
  ).then(affectedRows => {
    logger.info("[CONTROLLER](delete user) AffectedRow : "+affectedRows);
    // affectedRows will be 11
    return affectedRows === 1
      ? Promise.resolve("The user [id="+id+"] has been deleted")
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  });
}



const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true
            }),
            Users.excludeAttributes
          ),
          user.comparePassword(password)
        ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

module.exports = {
  createUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser
};
