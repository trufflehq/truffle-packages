import { App } from "alosaur/mod.ts";
import { SpotifyArea } from './areas/spotify.area.ts'

const app = new App({
  areas: [SpotifyArea],
  logging: true,
});

app.listen();
