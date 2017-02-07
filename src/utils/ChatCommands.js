import find from 'array-find';
import { CHAT_COMMAND } from '../constants/actionTypes/chat';

const debug = require('debug')('uwave:chat-commands');

export function canExecute(state, { guard } = {}) {
  return guard ? guard(state) : true;
}

// Helper to consistently find online users in command handlers.
export function findUser(users, username) {
  const lname = username.toLowerCase();
  return find(users, o => o.username.toLowerCase() === lname);
}

export default class ChatCommands {
  commands = {};

  getCommands() {
    return this.commands;
  }

  register(name, description, { action, guard }) {
    this.commands[name] = { description, action, guard };
    return this;
  }

  execute(state, name, args = []) {
    debug('execute', name, args);
    if (this.commands[name]) {
      const allowed = canExecute(state, this.commands[name]);
      debug('canExecute', allowed);
      if (allowed) {
        return this.commands[name].action(...args);
      }
    }
    return null;
  }

  middleware() {
    return ({ dispatch, getState }) => next => (action) => {
      console.log('middleware', action);
      if (action && action.type === CHAT_COMMAND) {
        const { name, args } = action.payload;
        const result = this.execute(getState(), name, args);
        if (result) {
          dispatch(result);
        }
      }
      next(action);
    };
  }
}
