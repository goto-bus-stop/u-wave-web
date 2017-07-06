import { get, put, del } from './RequestActionCreators';

export const LOAD_EMOJI_START = 'uwave/emoji/LOAD_EMOJI_START';
export const LOAD_EMOJI_COMPLETE = 'uwave/emoji/LOAD_EMOJI_COMPLETE';
export const CREATE_EMOJI_START = 'uwave/emoji/CREATE_EMOJI_START';
export const CREATE_EMOJI_COMPLETE = 'uwave/emoji/CREATE_EMOJI_COMPLETE';
export const DELETE_EMOJI_START = 'uwave/emoji/DELETE_EMOJI_START';
export const DELETE_EMOJI_COMPLETE = 'uwave/emoji/DELETE_EMOJI_COMPLETE';
export const EMOJI_ADDED = 'uwave/emoji/EMOJI_ADDED';
export const EMOJI_DELETED = 'uwave/emoji/EMOJI_DELETED';

export function loadEmoji() {
  return get('/emoji', {
    onStart: () => ({ type: LOAD_EMOJI_START }),
    onComplete: res => ({
      type: LOAD_EMOJI_COMPLETE,
      payload: res.data
    })
  });
}

export function createEmoji(shortcode, file) {
  return put(`/emoji/${encodeURIComponent(shortcode)}`, file, {
    headers: { 'content-type': file.type || 'application/octet-stream' },
    onStart: () => ({
      type: CREATE_EMOJI_START,
      payload: { shortcode }
    }),
    onComplete: res => ({
      type: CREATE_EMOJI_COMPLETE,
      payload: res.data
    })
  });
}

export function deleteEmoji(shortcode) {
  return del(`/emoji/${encodeURIComponent(shortcode)}`);
}

export function emojiAdded(emoji) {
  return {
    type: EMOJI_ADDED,
    payload: emoji
  };
}

export function emojiRemoved(shortcode) {
  return {
    type: EMOJI_DELETED,
    payload: { shortcode }
  };
}
