import { App, CorsBuilder } from "alosaur/mod.ts";
import { SpotifyArea } from "./areas/spotify.area.ts";

const app = new App({
  areas: [SpotifyArea],
  logging: true,
});
app.useCors(
  new CorsBuilder()
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader(),
);

app.listen();
