import { RTM_EVENTS } from '@slack/client';
import _debug from 'debug';
import rtm from './rtm';
import { isInChannel } from './channels';

import {
  getOrCreateChannelPlaylist,
  addTracksToChannelPlaylist,
} from './playlists';

const debugError = _debug('spotbot:error');

function formatText(text) {
  return text
    .replace(/<([^<>]+)>/g, '$1')
    .replace(/\b(https?:\/\/open\.spotify\.com\/)([^\s]+)\b/g, (...match) =>
      `spotify:${match[2].replace(/\//g, ':')}`
    );
}

function isMentioned(text) {
  return text.indexOf(`@${rtm.activeUserId}`) >= 0;
}

function wantsPlaylist(text = '') {
  return isMentioned(text) && /\bplaylist\b/.test(text);
}

function getTrackUris(text = '') {
  const trackUris = formatText(text).match(/\bspotify:track:[^:\s]+\b/g) || [];

  return trackUris
    .filter((trackUri, i) => trackUris.indexOf(trackUri) === i); // unique uris
}

rtm.on(RTM_EVENTS.MESSAGE, message => {
  const {
    text,
    user,
    channel,
    subtype,
  } = message;

  if (!!subtype || !isInChannel(channel)) return;

  if (wantsPlaylist(text)) {
    getOrCreateChannelPlaylist(channel)
      .then(playlist =>
        rtm.sendMessage(`<@${user}>: ${playlist.uri}`, channel)
      )
      .catch(err => {
        debugError(err);
        rtm.sendMessage('an error occured', channel);
      });
  }

  const trackUris = getTrackUris(text);

  if (trackUris && trackUris.length) {
    addTracksToChannelPlaylist(channel, trackUris)
      .then(() => {
        rtm.sendMessage(`<@${user}>: tracks added to playlist!`, channel);
      })
      .catch(err => {
        debugError(err);
        rtm.sendMessage('an error occured', channel);
      });
  }
});

rtm.start();
