const TODO = 'todo';
const INPROGRESS = 'in-progress';
const DONE = 'done';

const states = {
  [TODO]: INPROGRESS,
  [INPROGRESS]: DONE,
  [DONE]: TODO,
};

const getNextStatus = currentState => states[currentState];

const getDefaultStatus = () => TODO;

module.exports = { getDefaultStatus, getNextStatus };
