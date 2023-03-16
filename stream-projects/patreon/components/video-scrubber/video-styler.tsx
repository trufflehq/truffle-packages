import React, { useEffect } from "https://npm.tfl.dev/react";
import jumper from "https://tfl.dev/@truffle/utils@~0.0.2/jumper/jumper.ts";

// TODO

type Timestamp = {
  timeSeconds: number;
  label: string;
};

type VideoScrubberProps = {
  durationSeconds: number;
  timestamps: Timestamp;
};

function VideoScrubber({ durationSeconds, timestamps }: VideoScrubberProps) {
  return (
    <div className="c-video-scrubber">
    </div>
  );
}

export default VideoScrubber;
