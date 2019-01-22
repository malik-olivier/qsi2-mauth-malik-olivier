module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define(
    'Groups',
    {
      id: {
        // Avoid usage of auto-increment numbers, UUID is a better choice
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        comment: 'Group ID',
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        comment: 'Group title',
        unique : true,
        allowNull: false
      },
      description : {
        type: DataTypes.STRING,
        comment: 'Group description',
        allowNull: false
      },
      metadata: {
        type: DataTypes.JSONB,
        comment: 'Group metadata'
      }
    },
    {
      // logical delete over physical delete
      paranoid: true
    }
  );
  return Groups;
};


