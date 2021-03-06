import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import BaseList from 'react-list';
import LazyList from 'react-list-lazy-load';
import itemSelection from 'item-selection/immutable';
import Row from './Row';
import LoadingRow from './LoadingRow';

export default class MediaList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    media: PropTypes.array,
    size: PropTypes.number,
    onRequestPage: PropTypes.func,
    rowComponent: PropTypes.func,
    rowProps: PropTypes.object,

    onOpenPreviewMediaDialog: PropTypes.func,
    makeActions: PropTypes.func
  };

  static defaultProps = {
    // The `size` property is only necessary for lazy loading.
    size: null,
    rowComponent: Row,
    makeActions: () => <span />
  };

  state = { selection: itemSelection(this.props.media) };

  componentWillReceiveProps(nextProps) {
    if (nextProps.media !== this.props.media) {
      this.setState({
        selection: itemSelection(nextProps.media)
      });
    }
  }

  selectItem(index, e) {
    e.preventDefault();

    let { selection } = this.state;

    if (e.shiftKey) {
      selection = selection.selectRange(index);
    } else if (e.ctrlKey) {
      selection = selection.selectToggle(index);
    } else {
      selection = selection.select(index);
    }

    this.setState({ selection });
  }

  renderRow = (index, key) => {
    const makeActions = this.props.makeActions;
    const props = this.props.rowProps || {};
    const media = this.props.media[index];
    const { selection } = this.state;
    const selected = selection.isSelectedIndex(index);
    if (!media) {
      return (
        <LoadingRow
          key={key}
          className="MediaList-row"
          selected={selected}
        />
      );
    }
    const MediaRow = this.props.rowComponent;
    const isAlternate = index % 2 === 0;
    return (
      <MediaRow
        key={key}
        {...props}
        className={cx('MediaList-row', isAlternate && 'MediaListRow--alternate')}
        media={media}
        selected={selected}
        selection={selection.get()}
        onClick={e => this.selectItem(index, e)}
        onOpenPreviewMediaDialog={this.props.onOpenPreviewMediaDialog}
        makeActions={() => makeActions(media, selection, index)}
      />
    );
  };

  render() {
    const { className, media, size, onRequestPage } = this.props;
    let list = (
      <BaseList
        itemRenderer={this.renderRow}
        length={size || media.length}
        type="uniform"
        forceUpdateOnMediaChange={media}
        forceUpdateOnSelectionChange={this.state.selection}
      />
    );
    if (onRequestPage) {
      list = (
        <LazyList
          items={media}
          length={size || media.length}
          pageSize={50}
          onRequestPage={onRequestPage}
        >
          {list}
        </LazyList>
      );
    }
    return (
      <div className={cx('MediaList', className)}>
        {list}
      </div>
    );
  }
}
