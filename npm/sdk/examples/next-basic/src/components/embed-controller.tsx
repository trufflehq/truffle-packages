import { getEmbed } from '@trufflehq/sdk';
import { useRef } from 'react';

export default function EmbedController() {
  const hasBorder = useRef(false);

  const toggleBorder = () => {
    // Get the embed instance
    const embed = getEmbed();

    if (hasBorder.current) {
      // clear the border
      embed.setStyles({ border: 'none' });
    } else {
      // set the border
      embed.setStyles({ border: '5px solid #f00' });
    }
    hasBorder.current = !hasBorder.current;
  };

  return (
    <div className="c-embed-controller">
      <div>
        <button onClick={toggleBorder}>Toggle border</button>
      </div>
    </div>
  );
}
