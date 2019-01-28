module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define(
      'Posts',
      {
        id: {
          // Avoid usage of auto-increment numbers, UUID is a better choice
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          comment: 'Group ID',
          primaryKey: true
        },
        message: {
          type: DataTypes.STRING,
          comment: 'Message post',
          unique : true,
          allowNull: false
        }
      },
      {
        // logical delete over physical delete
        paranoid: true
      }
    );

    return Posts;
  };
  
  
  