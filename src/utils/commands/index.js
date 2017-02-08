import bansCommands from './bans';
import chatCommands from './chat';
import helpCommands from './help';
import mutesCommands from './mutes';
import staffCommands from './staff';
import userCommands from './user';
import waitlistCommands from './waitlist';

export default function defaultCommands(ctx) {
  bansCommands(ctx);
  chatCommands(ctx);
  helpCommands(ctx);
  mutesCommands(ctx);
  staffCommands(ctx);
  userCommands(ctx);
  waitlistCommands(ctx);
}
