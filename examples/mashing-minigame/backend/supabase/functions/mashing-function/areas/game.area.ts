import { Area } from "https://deno.land/x/alosaur@v0.33.0/mod.ts";

import { GameController } from '../controllers/game.controller.ts'

@Area({
  baseRoute: "/mashing-function",
  controllers: [GameController],
})
export class GameArea {}
