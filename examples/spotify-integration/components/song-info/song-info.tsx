import React from "https://npm.tfl.dev/react";
import { JSX } from "https://npm.tfl.dev/react";
import Stylesheet from "https://tfl.dev/@truffle/ui@0.0.1/components/stylesheet/stylesheet.js";
import { Artist, SpotifyData } from "../spotify-component/spotify-component";

function pad(n: number): string {
  //pads 1 digit numbers to have a leading zero
  return n < 10 ? `0${n}` : n.toString();
}

function formatDate(d: Date): string {
  //handle edge case for songs longer than an hour
  if (d.getUTCHours()) {
    return `${d.getUTCHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  return `${d.getMinutes()}:${pad(d.getSeconds())}`;
}

export default function SongInfo(
  { spotifyData: { title, link, artists, length }, percentDone, progressDate }:
    { spotifyData: SpotifyData; percentDone: number; progressDate: Date },
) {
  return (
    <div className={"song-info "}>
      <div className={"artist-title-container "}>
        <div className="song-title">
          <a
            draggable="false"
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
        </div>
        <div className="artist-name">
          {artists.map((artist: Artist) => (
            <p key={artist.external_urls.spotify}>
              <a
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                {artist.name}
              </a>
            </p>
          ))}
        </div>
      </div>
      <div className="progress-text-container">
        <div className="progress">{formatDate(progressDate)}</div>
        <div className="length">{formatDate(new Date(length))}</div>
      </div>
      <div className="progress-bar-outer">
        <div
          className="progress-bar-inner"
          style={{
            "--song-position": `${percentDone * 100}%`,
          } as React.CSSProperties}
        >
        </div>
      </div>
    </div>
  ) as JSX.ReactNode;
}
