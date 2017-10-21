const Event = require('./data').Event;
const Answer = require('./data').Answer;

const simplePromise = (err, res) => {
  return err ? new Promise((resolve, reject) => { reject(err); }) : new Promise((resolve, reject) => { resolve(res); });
};
// check if an event id is a valid uuid
const isValidEventId = (id) => {
  var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi; // eslint-disable-line
  return regexGuid.test(id);
};
// get event data
const getEvent = async (id) => {
  return Event.findOne({ where: { id: id } });
};
// delete an event
const deleteEvent = async (id) => {
  await Answer.destroy({ where: { event_id: id } });
  return Event.destroy({ where: { id: id } });
};
// get event date from event number
const getTournamentEvent = async (tournament, eventNumber) => {
  return Event.findOne({ where: { event_number: eventNumber, tournament_id: tournament.id } });
};
// get event by id or create a new one
const getOrCreateEvent = async (id, tournamentId) => {
  const event = await getEvent(id);
  if (event) {
    return simplePromise(null, event);
  }
  return createEvent(tournamentId);
};
// get last created event of a tournament
const getLastTournamentEvent = async (tournamentId) => {
  return Event.findOne({ where: { tournament_id: tournamentId }, order: [['created_at', 'DESC']] });
};
// create a new event
const createEvent = async (tournamentId) => {
  const eventNumber = await Event.count({
    where: [{ tournament_id: tournamentId }]
  });
  return Event.create({
    questions: [],
    event_number: eventNumber,
    tournament_id: tournamentId
  });
};
// save event field
const saveEventField = async (event, fieldName, fieldValue, callback) => {
  event[fieldName] = fieldValue;
  return event.save(); // update({ questions: questions }, { where: { id: id } })
};
// tournament events
const getEventsList = async (tournament, callback) => {
  return Event.findAll({ where: { tournament_id: tournament.id }, attributes: ['id', 'questions', 'last_answer_at', 'close_at'], order: [['updated_at', 'DESC']] });
};
// save an user bet 
const saveUserAnswers = async (user, tournament, event, answers) => {
  // Answers.upsert(user.id, event.id);
  for (let a = 0; a < answers.length; a++) {
    var data = {
      tournament_id: tournament.id,
      event_id: event.id,
      user_id: user.id,
      question_number: a
    };
    var choices = event.questions[a] && event.questions[a].choices;
    if (!choices || choices.length === 0) {
      try {
        data.answer_numerical_value = parseInt(answers[a], 10);
      } catch (e) {
        console.error(e);
        data.answer_numerical_value = 0;
      }
    } else {
      data.answer_choice_number = null;
      for (let c = 0; c < choices.length; c++) {
        if (choices[c] === answers[a]) {
          data.answer_choice_number = c;
          break;
        }
      }
      if (data.answer_choice_number === null) { continue; }
    }
    await Answer.upsert(data);
    // await Event.update({ last_answer_at: new Date() }, { where: { id: event.id } });
    event.last_answer_at = new Date();
    await event.save();
  }
};
// get all answers for an event
const getUsersAnswers = async (event) => {
  return Answer.findAll({ where: { event_id: event.id } });
};
// set true or false to is_correct field answers
const setCorrectnessOfUsersAnswers = async (event, questionNumber, answerChoiceNumber, answerNumericalValue, bool) => {
  const query = {
    event_id: event.id
  };
  if (questionNumber !== null) {
    query.question_number = questionNumber;
  }
  if (answerChoiceNumber !== null) {
    query.answer_choice_number = answerChoiceNumber;
  }
  if (answerNumericalValue !== null) {
    query.answer_numerical_value = answerNumericalValue;
  }
  return Answer.update(
    {
      is_correct: bool,
      points: bool ? 1 : 0
    },
    {
      where: query
    }
  );
};
module.exports = {
  isValidEventId,
  createEvent,
  getEvent,
  deleteEvent,
  getOrCreateEvent,
  getLastTournamentEvent,
  getEventsList,
  saveEventField,
  saveUserAnswers,
  getUsersAnswers,
  setCorrectnessOfUsersAnswers,
  getTournamentEvent
};
