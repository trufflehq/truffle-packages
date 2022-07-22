import { Body, Controller, ForbiddenError, Post } from "alosaur/mod.ts";
import { IncrementModelDTO } from "../models/mod.ts";
import { GameService } from "../services/game.service.ts";
import { hasPermission, validateDTO } from "../utils/mod.ts";

@Controller("/game")
export class GameController {
  private gameService: GameService;
  constructor() {
    this.gameService = new GameService();
  }

  @Post("/increment")
  async start(@Body(IncrementModelDTO) dto: IncrementModelDTO) {
    await validateDTO(dto);
    const canIncrement = hasPermission(dto.data?.orgUser, "everyone");

    if (!canIncrement) {
      throw new ForbiddenError("Insufficient permissions");
    }

    return this.gameService.increment(dto);
  }
}
