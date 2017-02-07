import { canExecute } from '../ChatCommands';
import { log } from '../../actions/ChatActionCreators';

export default function helpCommands(ctx) {
  ctx.register('help', 'List available commands.', {
    action: () => (dispatch, getState) => {
      const available = ctx.getCommands();
      dispatch(log('Available commands:'));
      Object.keys(available).sort().forEach((name) => {
        const command = available[name];
        if (canExecute(getState(), command)) {
          dispatch(log(`/${name} - ${command.description}`));
        }
      });
    }
  });
}
