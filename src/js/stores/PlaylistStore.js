import assign from 'object-assign';
import EventEmitter from 'events';
import values from 'object-values';
import dispatcher from '../dispatcher';

const playlists = {};
const playlistWips = {};
let activePlaylistID = null;
let activeMedia = [];
let selectedPlaylistID = null;
let selectedMedia = [];

const activePlaylist = () => playlists[activePlaylistID] || playlistWips[activePlaylistID];
const selectedPlaylist = () => playlists[selectedPlaylistID] || playlistWips[selectedPlaylistID];

function selectPlaylist(playlistID) {
  if (selectedPlaylist()) {
    selectedPlaylist().selected = false;
    selectedMedia = [];
  }
  if (playlistID) {
    selectedPlaylistID = playlistID;
    selectedPlaylist().selected = true;
    if (activePlaylistID && selectedPlaylistID === activePlaylistID) {
      selectedMedia = activeMedia;
    } else {
      selectedMedia = selectedPlaylist().media || [];
    }
  }
}

function activatePlaylist(playlistID) {
  if (activePlaylist()) {
    activePlaylist().active = false;
    activeMedia = [];
  }
  if (playlistID) {
    activePlaylistID = playlistID;
    activePlaylist().active = true;
    if (selectedPlaylistID && activePlaylistID === selectedPlaylistID) {
      activeMedia = selectedMedia;
    } else {
      activeMedia = activePlaylist().media || [];
    }
  }
}

// TODO use a stack or counter here to ensure that multiple concurrent
// operations all get completed before setting the playlist to "not loading"
function setLoading(playlistId, loading = true) {
  if (playlists[playlistId] && playlists[playlistId].loading !== loading) {
    playlists[playlistId].loading = loading;
    // something changed!
    return true;
  }
}

const PlaylistStore = assign(new EventEmitter, {
  getActivePlaylist() {
    return activePlaylist();
  },
  getActiveMedia() {
    return activeMedia;
  },
  getSelectedPlaylist() {
    return selectedPlaylist() || activePlaylist();
  },
  getSelectedMedia() {
    return selectedMedia;
  },
  getPlaylists() {
    return values(playlists)
      .concat(values(playlistWips));
  },

  dispatchToken: dispatcher.register(({ type, payload, meta, error }) => {
    switch (type) {
    case 'loadedPlaylists':
      if (error) break;
      payload.playlists.forEach(playlist => {
        playlists[playlist._id] = playlist;
      });
      if (!activePlaylistID && payload.playlists.length > 0) {
        activatePlaylist(payload.playlists[0]._id);
      }
      if (!selectedPlaylistID && payload.playlists.length > 0) {
        selectPlaylist(payload.playlists[0]._id);
      }
      PlaylistStore.emit('change');
      break;
    case 'activatePlaylist':
      // TODO use a different property here so we can show a loading icon on
      // the "Active" button only, instead of on top of the entire playlist
      setLoading(payload.playlistID);
      PlaylistStore.emit('change');
      break;
    case 'activatedPlaylist':
      setLoading(payload.playlistID, false);
      activatePlaylist(payload.playlistID);
      PlaylistStore.emit('change');
      break;
    case 'selectPlaylist':
      selectPlaylist(payload.playlistID);
      PlaylistStore.emit('change');
      break;
    case 'searchStart':
      // Switch to displaying search results
      selectPlaylist(null);
      PlaylistStore.emit('change');
      break;

    case 'loadingPlaylist':
      if (setLoading(payload.playlistID)) {
        PlaylistStore.emit('change');
      }
      break;
    case 'loadedPlaylist':
      if (playlists[payload.playlistID]) {
        playlists[payload.playlistID].loading = false;
      }
      if (selectedPlaylistID === payload.playlistID) {
        selectedMedia = payload.media;
      }
      if (activePlaylistID === payload.playlistID) {
        activeMedia = payload.media;
      }
      PlaylistStore.emit('change');
      break;

    case 'creatingPlaylist':
      playlistWips[meta.tempId] = {
        _id: meta.tempId,
        name: payload.name,
        description: payload.description,
        shared: payload.shared,
        creating: true
      };
      selectPlaylist(meta.tempId);
      PlaylistStore.emit('change');
      break;
    case 'createdPlaylist':
      delete playlistWips[meta.tempId];
      if (error) {
        debug('could not create playlist', payload.message);
      } else {
        playlists[payload.playlist._id] = payload.playlist;
        selectPlaylist(payload.playlist._id);
      }
      PlaylistStore.emit('change');
      break;

    case 'addMediaToPlaylist':
      if (setLoading(payload.playlistID)) {
        PlaylistStore.emit('change');
      }
      break;
    case 'addedMediaToPlaylist':
      if (error) break;
      const updatedPlaylist = playlists[payload.playlistID];
      if (updatedPlaylist) {
        updatedPlaylist.loading = false;
        updatedPlaylist.size = payload.newSize;
        if (selectedPlaylistID === updatedPlaylist._id) {
          selectedMedia.push(...payload.appendedMedia);
        } else if (activePlaylistID === updatedPlaylist._id) {
          activeMedia.push(...payload.appendedMedia);
        }
      }
      PlaylistStore.emit('change');
      break;

    default:
      // Not for us
    }
  })
});

export default PlaylistStore;
