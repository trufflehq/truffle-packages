import React from "https://npm.tfl.dev/react";
export { useStream };
export { StreamProvider };
declare type StreamUtils = {
  injectToStream: (htmlChunk: string) => void;
};
declare const StreamProvider: React.Provider<StreamUtils | null>;
declare function useStream(): StreamUtils | null;
