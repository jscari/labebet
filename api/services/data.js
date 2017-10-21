const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL,
  {
    define: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);
// http://docs.sequelizejs.com/manual/tutorial/models-definition.html#data-types

const Tournament = sequelize.define('tournaments', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
  slug: Sequelize.STRING,
  name: Sequelize.STRING,
  player_secret: Sequelize.STRING
}, { underscored: true });
const Event = sequelize.define('events', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
  event_number: { type: Sequelize.INTEGER },
  questions: Sequelize.JSON,
  close_at: Sequelize.DATE,
  last_answer_at: Sequelize.DATE
}, { underscored: true });
Event.belongsTo(Tournament);
const User = sequelize.define('users', {
  id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
  name: { type: Sequelize.STRING, unique: 'uuser' },
  password: { type: Sequelize.STRING },
  type: { type: Sequelize.STRING, defaultValue: 'internal', unique: 'uuser' },
  tournament_slug: { type: Sequelize.STRING, defaultValue: '', unique: 'uuser' }
},
{
  underscored: true,
  indexes: [
    { fields: ['type', 'tournament_slug'] }
  ]
});
// User.belongsTo(Tournament);
const Answer = sequelize.define('answers', {
  question_number: { type: Sequelize.INTEGER },
  answer_choice_number: { type: Sequelize.INTEGER, default: null },
  answer_numerical_value: { type: Sequelize.REAL, default: null },
  is_correct: { type: Sequelize.BOOLEAN, default: null },
  points: { type: Sequelize.INTEGER, default: 0 }
},
{
  underscored: true,
  indexes: [
    { fields: ['question_number'] },
    { fields: ['answer_choice_number'] },
    { fields: ['answer_numerical_value'] }
  ]
});
Answer.belongsTo(Tournament);
Answer.belongsTo(Event);
Answer.belongsTo(User);
// force: true will drop the table if it already exists
async function init () {
  try {
    await Tournament.sync({force: false});
    console.log('Table Tournament: sync');
    await Event.sync({force: false});
    console.log('Table Event: sync');
    await User.sync({force: false});
    console.log('Table User: sync');
    await Answer.sync({force: false});
    console.log('Table Answer: sync');
    if (process.env.PREFILL_DB) {
      // TODO remove
      await Tournament.upsert({ id: '02c2a1e0-9f1c-11e7-8a69-e9908711aa08', name: 'Pronos 2017-2018', slug: 'pronos1718', player_secret: 'parcequetoulonrct' });
      console.log('Tournois pronos créé');
    }
  } catch (e) {
    console.error(e);
  }
}
init();
module.exports = {
  User,
  Event,
  Tournament,
  Answer
};
