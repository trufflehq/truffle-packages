import { Area } from "alosaur/mod.ts";

import { SpotifyAuthController } from "../controllers/spotify-auth.controller.ts";
import { SongController } from '../controllers/song.controller.ts'
@Area({
  baseRoute: "/spotify",
  controllers: [SpotifyAuthController, SongController],
})
export class SpotifyArea {}
