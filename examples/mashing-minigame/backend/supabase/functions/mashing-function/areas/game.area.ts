import { Area } from "alosaur/mod.ts";

import { GameController } from "../controllers/game.controller.ts";

@Area({
  baseRoute: "/mashing-function",
  controllers: [GameController],
})
export class GameArea {}
