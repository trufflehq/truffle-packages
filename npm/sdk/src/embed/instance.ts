import { getEmbedConsumer } from '../transframe/embed-consumer';
import { Embed } from './embed';

let embed: Embed;

export function getEmbed() {
  if (!embed) {
    // make sure we can initialize the embed consumer;
    getEmbedConsumer();
    embed = new Embed();
  }

  return embed;
}
