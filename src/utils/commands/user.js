import { doChangeUsername } from '../../actions/UserActionCreators';

export default function userCommands(ctx) {
  ctx.register(
    'nick',
    'Change your username.',
    { action: doChangeUsername }
  );
}
