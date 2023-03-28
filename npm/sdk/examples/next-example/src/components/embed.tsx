import { getEmbed } from '@trufflehq/sdk';
import { useEffect } from 'react';

export default function EmbedTest() {
  useEffect(() => {
    const embed = getEmbed();
    embed.setStyles({ border: '5px solid #f00' });
  }, []);

  return <h1>Embed test</h1>;
}
