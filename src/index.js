import { RtmClient, RTM_EVENTS } from '@slack/client';
import onMessage from './onMessage';

const token = process.env.SLACK_API_TOKEN || '';
const rtm = new RtmClient(token, { logLevel: 'debug' });

rtm.on(RTM_EVENTS.MESSAGE, onMessage(rtm));
