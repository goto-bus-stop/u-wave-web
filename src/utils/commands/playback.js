import { register } from '../ChatCommands';
import { log } from '../../actions/ChatActionCreators';
import {
  setVolume,
  mute,
  unmute
} from '../../actions/PlaybackActionCreators';

register(
  'volume',
  'Set the current volume.',
  {
    action: (value) => {
      const volume = parseInt(value, 10);
      if (!isFinite(volume) || volume < 0 || volume > 100) {
        return log('Volume must be a number between 0 and 100.');
      }
      return setVolume(volume);
    }
  }
);

register('mute', 'Mute the volume.', {
  action: () => mute()
});

register('unmute', 'Unmute the media volume.', {
  action: () => unmute()
});
