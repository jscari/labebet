const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

if (require.main === module) {
  const res = [];
  ['Aurélien', 'Bastien', 'Cyrille', 'Jean-Sébastien', 'Mathias', 'Mickael', 'Riad', 'Thomas'].forEach(name => {
    res.push({name, check: crypto.createHmac('sha256', 'parcequetoulonrct').update(name).digest('hex')});
  });
  console.log(res);
  // process.exit();
}

const User = require('./data').User;

const simplePromise = (err, res) => {
  return err ? new Promise((resolve, reject) => { reject(err); }) : new Promise((resolve, reject) => { resolve(res); });
};
// is an user owner of an event
const isOwner = (userId, eventId) => true;
// get internal user from player name
const getInternalUser = async (username) => {
  return User.findOne({ where: { name: username, type: 'internal' } });
};
// a player is an user playing an event
// a player can be an user from another website, in this case, we don't store any password
// the website just send us a variable with the playerName and checksum
// expl:
// tournamentPlayerSecret is'toto'
// playerName is'js'
// and playerCheck would be 'es' + sha256('js', 'secret='toto')
const getExternalUser = async (tournamentPlayerSecret, playerName, playerCheck) => {
  const test = crypto.createHmac('sha256', tournamentPlayerSecret).update(playerName).digest('hex');
  if (test !== playerCheck.substr(2)) {
    return simplePromise(new Error('Invalid playerCheck'));
  }
  return User.findOne({ where: { name: playerName } });
};

// create an internal user
const createInternalUser = async (username, password) => {
  return User.create({ name: username, password: bcrypt.hashSync(password, 10) });
};
// check internal user password
const checkPassword = (user, password) => {
  return user.password === bcrypt.hashSync(password, 10);
};
// create an external user (from another website)
const createExternalUser = async (tournamentSlug, tournamentPlayerSecret, playerName, playerCheck) => {
  const test = crypto.createHmac('sha256', tournamentPlayerSecret).update(playerName).digest('hex');
  if (test !== playerCheck.substr(2)) {
    return simplePromise(new Error('Invalid playerCheck'));
  }
  await User.create({ name: playerName, tournamentSlug, type: 'external' });
  return User.findOne({ where: { name: playerName, tournamentSlug, type: 'external' } });
};
const getUserFromJWT = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return getInternalUser(decoded.username);
};

module.exports = {
  getInternalUser,
  getExternalUser,
  createExternalUser,
  createInternalUser,
  checkPassword,
  isOwner,
  getUserFromJWT
};
