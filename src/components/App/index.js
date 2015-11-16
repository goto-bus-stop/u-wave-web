import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import LoginStore from '../../stores/LoginStore';
import SettingsStore from '../../stores/SettingsStore';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MuiTheme from '../../MuiTheme';
import Chat from '../Chat';
import ChatInput from '../Chat/Input';
import RoomUserList from '../UserList/RoomUserList';
import WaitList from '../UserList/WaitList';
import FooterBar from '../FooterBar';
import HeaderBar from '../HeaderBar';
import PanelSwitcher from '../PanelSwitcher';
import PanelGroup from '../PanelSwitcher/Group';
import Panel from '../PanelSwitcher/Panel';
import Video from '../Video';
import Overlays from './Overlays';
import PlaylistManager from '../PlaylistManager';
import LoginModal from '../LoginModal';
import listen from '../../utils/listen';

function getState() {
  return {
    settings: SettingsStore.getAll(),
    user: LoginStore.getUser()
  };
}

@DragDropContext(HTML5Backend)
@listen(SettingsStore, LoginStore)
export default class App extends React.Component {
  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  state = getState();

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(MuiTheme)
    };
  }

  onChange() {
    this.setState(getState());
  }

  render() {
    const { settings, user } = this.state;
    const isLoggedIn = !!user;

    return (
      <div className="App">
        <div className="AppColumn AppColumn--left">
          <div className="AppRow AppRow--top">
            <HeaderBar
              className="App-header"
              title="üWave"
            />
          </div>
          <div className="AppRow AppRow--middle">
            <Video size={settings.videoSize} />
          </div>
          <Overlays transitionName="Overlay">
            <PlaylistManager key="playlistManager" />
          </Overlays>
          <FooterBar className="AppRow AppRow--bottom" />
        </div>

        <div className="AppColumn AppColumn--right">
          <div className="AppRow AppRow--top">
            <PanelSwitcher />
          </div>
          <PanelGroup className="AppRow AppRow--middle">
            <Panel name="chat">
              <Chat />
            </Panel>
            <Panel name="room">
              <RoomUserList />
            </Panel>
            <Panel name="waitlist">
              <WaitList />
            </Panel>
          </PanelGroup>
          <div className="AppRow AppRow--bottom ChatInputWrapper">
            {isLoggedIn && <ChatInput />}
          </div>
        </div>

        <LoginModal />
      </div>
    );
  }
}