import bansCommands from './bans';
import chatCommands from './chat';
import helpCommands from './help';
import mutesCommands from './mutes';
import staffCommands from './staff';
import waitlistCommands from './waitlist';

export default function defaultCommands(ctx) {
  bansCommands(ctx);
  chatCommands(ctx);
  helpCommands(ctx);
  mutesCommands(ctx);
  staffCommands(ctx);
  waitlistCommands(ctx);
}
