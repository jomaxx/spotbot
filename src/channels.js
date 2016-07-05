import { CLIENT_EVENTS, RTM_EVENTS } from '@slack/client';
import rtm from './rtm';

const {
  AUTHENTICATED,
} = CLIENT_EVENTS.RTM;

const {
  CHANNEL_JOINED,
  CHANNEL_LEFT,
} = RTM_EVENTS;

let channelsIn;

rtm.on(AUTHENTICATED, ({ channels }) => {
  channelsIn = {};

  channels.forEach(channel => {
    if (!channel.is_member) return;
    channelsIn[channel.id] = channel;
  });
});

rtm.on(CHANNEL_JOINED, ({ channel }) => {
  channelsIn[channel.id] = channel;
});

rtm.on(CHANNEL_LEFT, ({ channel }) => {
  delete channelsIn[channel.id];
});

export function isInChannel(channelId) {
  return !!channelsIn[channelId];
}
