import { RtmClient } from '@slack/client';
const { SLACK_API_TOKEN: token } = process.env;

const rtm = new RtmClient(token, {
  logLevel: 'error',
});

export default rtm;
