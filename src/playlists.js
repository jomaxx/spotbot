import spotifyApi from './spotifyApi';

const channelPlaylists = {};

function getPlaylists() {
  return spotifyApi.refreshAccessToken()
    .then(() => spotifyApi.getMe())
    .then(data => data.body.id)
    .then(userId => spotifyApi.getUserPlaylists(userId))
    .then(data => {
      data.body.items.forEach(playlist => {
        // playlist.name is channelId
        channelPlaylists[playlist.name] = playlist;
      });
    });
}

const getPlaylistsPromise = getPlaylists();

export function getOrCreateChannelPlaylist(channelId) {
  if (channelPlaylists.hasOwnProperty(channelId)) {
    return Promise.resolve(channelPlaylists[channelId]);
  }

  return getPlaylistsPromise
    .then(() => spotifyApi.refreshAccessToken())
    .then(() => spotifyApi.getMe())
    .then(data => data.body.id)
    .then(userId => spotifyApi.createPlaylist(userId, channelId))
    .then(data => data.body)
    .then(playlist => (channelPlaylists[channelId] = playlist));
}

export function addTracksToChannelPlaylist(channelId, trackUris) {
  return getOrCreateChannelPlaylist(channelId)
    .then(playlist => {
      const userId = playlist.owner.id;
      const playlistId = playlist.id;
      return spotifyApi.addTracksToPlaylist(userId, playlistId, trackUris);
    });
}
