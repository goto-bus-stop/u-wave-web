import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import PlaylistRow from './Row';
import PlaylistCreateRow from './NewPlaylist';
import SearchResultsRow from './SearchResultsRow';
import PlaylistImportRow from './PlaylistImportRow';

const Menu = ({
  className,
  playlists,
  selected,
  searchQuery,
  showSearchResults,
  searchResults,
  onCreatePlaylist,
  onSelectPlaylist,
  onSelectSearchResults,
  onAddToPlaylist,
  showImportPanel,
  onShowImportPanel
}) => {
  const searchIsSelected = showSearchResults ? 'is-selected' : '';
  const importIsSelected = showImportPanel ? 'is-selected' : '';
  const isSelectingPlaylist = selected && !showSearchResults && !showImportPanel;
  return (
    <div
      role="menu"
      className={cx('PlaylistMenu', className)}
    >
      <PlaylistCreateRow
        className="PlaylistMenu-row"
        onCreatePlaylist={onCreatePlaylist}
      />
      {searchQuery && (
        <SearchResultsRow
          className={cx('PlaylistMenu-row', searchIsSelected)}
          query={searchQuery}
          size={searchResults}
          onClick={onSelectSearchResults}
        />
      )}
      {playlists.map(pl => (
        <PlaylistRow
          key={pl._id}
          className="PlaylistMenu-row"
          playlist={pl}
          selected={isSelectingPlaylist && selected._id === pl._id}
          onClick={() => onSelectPlaylist(pl._id)}
          onAddToPlaylist={onAddToPlaylist}
        />
      ))}
      <PlaylistImportRow
        className={cx('PlaylistMenu-row', importIsSelected)}
        onClick={onShowImportPanel}
      />
    </div>
  );
};

Menu.propTypes = {
  className: PropTypes.string,
  playlists: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.object,
  showSearchResults: PropTypes.bool.isRequired,
  showImportPanel: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string,
  searchResults: PropTypes.number,
  onCreatePlaylist: PropTypes.func.isRequired,
  onSelectPlaylist: PropTypes.func.isRequired,
  onSelectSearchResults: PropTypes.func.isRequired,
  onAddToPlaylist: PropTypes.func.isRequired,
  onShowImportPanel: PropTypes.func.isRequired
};

export default Menu;
