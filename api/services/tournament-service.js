const Tournament = require('./data').Tournament;
const Answer = require('./data').Answer;
const User = require('./data').User;
const Sequelize = require('sequelize');

// get a tournament from it slug
const getTournamentFromSlug = async (slug) => {
  return Tournament.findOne({ where: { slug } });
};

// get tournament ranking
const getRanking = async (tournament) => {
  const users = await Answer.findAll({
    attributes: ['user.name', [Sequelize.fn('sum', Sequelize.col('points')), 'total']],
    include: [{ model: User, attributes: [ 'name', 'id' ] }],
    group: ['user.id']
  });
  const ranking = users.map(u => {
    return { name: u.user.name, points: u.dataValues.total };
  });
  ranking.sort((a, b) => {
    return b.points - a.points;
  });
  return ranking;
};
/*
SELECT name, SUM(points) as points
FROM answers, users
WHERE answers.user_id = users.id
GROUP BY users.id
ORDER BY points DESC

*/

module.exports = {
  getTournamentFromSlug,

  getRanking
};
