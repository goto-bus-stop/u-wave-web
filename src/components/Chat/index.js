import React, { Component, PropTypes } from 'react';

import LogMessage from './LogMessage';
import Message from './Message';
import Motd from './Motd';

export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.array,
    motd: PropTypes.array,
    onDeleteMessage: PropTypes.func,
    compileOptions: PropTypes.shape({
      availableEmoji: PropTypes.array,
      emojiImages: PropTypes.object
    })
  };

  componentDidMount() {
    this.scrollToBottom();
  }

  componentWillUpdate() {
    this._isScrolledToBottom = this.isScrolledToBottom();
  }

  componentDidUpdate() {
    if (this._isScrolledToBottom) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const el = this.container;
    el.scrollTop = el.scrollHeight;
  }

  isScrolledToBottom() {
    const el = this.container;
    const lastMessage = el.lastElementChild;
    if (lastMessage) {
      const neededSize = el.scrollTop + el.offsetHeight + lastMessage.offsetHeight;
      return neededSize >= el.scrollHeight - 20;
    }
    return true;
  }

  refContainer = (container) => {
    this.container = container;
  };

  renderMotd() {
    if (!this.props.motd) {
      return null;
    }
    return (
      <Motd compileOptions={this.props.compileOptions}>
        {this.props.motd}
      </Motd>
    );
  }

  renderMessage(msg, index) {
    const alternate = index % 2 === 0;
    if (msg.type === 'log') {
      return (
        <LogMessage
          key={msg._id}
          alternate={alternate}
          {...msg}
        />
      );
    }
    const onDelete = () => {
      this.props.onDeleteMessage(msg._id);
    };
    return (
      <Message
        key={msg._id}
        alternate={alternate}
        compileOptions={this.props.compileOptions}
        onDelete={onDelete}
        {...msg}
      />
    );
  }

  render() {
    return (
      <div className="Chat" ref={this.refContainer}>
        {this.renderMotd()}
        {this.props.messages.map(this.renderMessage, this)}
      </div>
    );
  }
}
