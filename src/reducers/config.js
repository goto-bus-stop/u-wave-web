import except from 'except';
import {
  LOAD_EMOJI_COMPLETE,
  EMOJI_ADDED,
  EMOJI_DELETED
} from '../actions/EmojiActionCreators';

const initialState = {
  emoji: {}
};

export default function reduce(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
  case LOAD_EMOJI_COMPLETE:
    return {
      ...state,
      emoji: payload
    };
  case EMOJI_ADDED:
    return {
      ...state,
      emoji: {
        ...state.emoji,
        [payload.shortcode]: payload.name
      }
    };
  case EMOJI_DELETED:
    return {
      ...state,
      emoji: except(state.emoji, payload.shortcode)
    };
  default:
    return state;
  }
}
