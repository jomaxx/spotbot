import { RTM_MESSAGE_SUBTYPES } from '@slack/client';

const {
  GROUP_TOPIC,
  CHANNEL_TOPIC,
} = RTM_MESSAGE_SUBTYPES;

export default rtm => {
  const handlers = {};

  handlers[GROUP_TOPIC] =
  handlers[CHANNEL_TOPIC] = function onTopicChange({ subtype }) {
    rtm.sendMessage(`received message: ${subtype}`);
  };

  return function onMessage(message) {
    const { subtype } = message;
    if (handlers.hasOwnProperty(subtype)) handlers[subtype](message);
  };
};
